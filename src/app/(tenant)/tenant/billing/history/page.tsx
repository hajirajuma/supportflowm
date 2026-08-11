'use client'

import { useState } from 'react'
import { useBilling } from '@/hooks/use-billing'
import { DataTable } from '@/components/ui/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { Invoice, InvoiceStatus, Transaction } from '@/types/billing'
import { formatDate, formatCurrency } from '@/lib/utils'
import { cn } from '@/lib/utils'
import { Download, Eye, FileText, CreditCard } from 'lucide-react'

export default function BillingHistoryPage() {
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const { useInvoices, useTransactions, downloadInvoice, isDownloadingInvoice } = useBilling()

  const { data: invoices, isLoading: isLoadingInvoices } = useInvoices({ page, limit })
  const { data: transactions, isLoading: isLoadingTransactions } = useTransactions({ page, limit })

  const getStatusColor = (status: InvoiceStatus) => {
    const colors = {
      draft: 'bg-muted text-muted-foreground',
      open: 'bg-warning/10 text-warning',
      paid: 'bg-success/10 text-success',
      uncollectible: 'bg-destructive/10 text-destructive',
      void: 'bg-muted text-muted-foreground',
    }
    return colors[status] || 'bg-muted text-muted-foreground'
  }

  const invoiceColumns: ColumnDef<Invoice>[] = [
    {
      accessorKey: 'invoiceNumber',
      header: 'Invoice',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{row.original.invoiceNumber}</span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: 'plan',
      header: 'Plan',
      cell: ({ row }) => {
        const items = row.original.items
        return items.length > 0 ? items[0].description : '—'
      },
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.total, row.original.currency),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge variant="outline" className={cn('capitalize', getStatusColor(row.original.status))}>
          {row.original.status}
        </Badge>
      ),
    },
    {
      id: 'actions',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              // View invoice
            }}
          >
            <Eye className="h-4 w-4" />
          </Button>
          {row.original.status === 'paid' && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => downloadInvoice(row.original.id)}
              disabled={isDownloadingInvoice}
            >
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      ),
    },
  ]

  const transactionColumns: ColumnDef<Transaction>[] = [
    {
      accessorKey: 'reference',
      header: 'Reference',
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <CreditCard className="h-4 w-4 text-muted-foreground" />
          <span className="font-mono text-sm">{row.original.reference}</span>
        </div>
      ),
    },
    {
      accessorKey: 'createdAt',
      header: 'Date',
      cell: ({ row }) => formatDate(row.original.createdAt),
    },
    {
      accessorKey: 'amount',
      header: 'Amount',
      cell: ({ row }) => formatCurrency(row.original.amount, row.original.currency),
    },
    {
      accessorKey: 'paymentMethod',
      header: 'Method',
      cell: ({ row }) => (
        <span className="capitalize">{row.original.paymentMethod}</span>
      ),
    },
    {
      accessorKey: 'status',
      header: 'Status',
      cell: ({ row }) => (
        <Badge
          variant="outline"
          className={cn('capitalize', {
            'bg-success/10 text-success': row.original.status === 'succeeded',
            'bg-warning/10 text-warning': row.original.status === 'processing',
            'bg-destructive/10 text-destructive': row.original.status === 'failed',
          })}
        >
          {row.original.status}
        </Badge>
      ),
    },
  ]

  if (isLoadingInvoices || isLoadingTransactions) {
    return <BillingHistorySkeleton />
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Billing History</h1>
        <p className="text-muted-foreground">
          View your invoices and payment history
        </p>
      </div>

      {/* Invoices Table */}
      <Card>
        <CardHeader>
          <CardTitle>Invoices</CardTitle>
          <CardDescription>
            All your invoices and receipts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={invoiceColumns}
            data={invoices?.data || []}
            total={invoices?.total || 0}
            page={page}
            limit={limit}
            onPageChange={setPage}
            isLoading={isLoadingInvoices}
          />
        </CardContent>
      </Card>

      {/* Transactions Table */}
      <Card>
        <CardHeader>
          <CardTitle>Transactions</CardTitle>
          <CardDescription>
            Payment transaction history
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={transactionColumns}
            data={transactions?.data || []}
            total={transactions?.total || 0}
            page={page}
            limit={limit}
            onPageChange={setPage}
            isLoading={isLoadingTransactions}
          />
        </CardContent>
      </Card>
    </div>
  )
}

function BillingHistorySkeleton() {
  return (
    <div className="space-y-6">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="mt-2 h-4 w-48" />
      </div>

      {Array.from({ length: 2 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Array.from({ length: 5 }).map((_, j) => (
                <div key={j} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-8 w-16" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}