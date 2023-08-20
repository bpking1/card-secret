"use client"

import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, MoreHorizontal } from "lucide-react"


import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { table } from "console"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type SecretKey = {
  id: number
  secret: string
  type: "day" | "week" | "month" | "year" | "count"
  isBanned: boolean
  scriptName: string
  cardValue: number
  userInfo: string
  firstUsedTime: string
  lastUsedTime: string
  dateCreated: string
  usedCount: number
  userIP: string
}

export const columns: ColumnDef<SecretKey>[] = [
  {
    accessorKey: "dateCreated",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          创建时间
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "secret",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          卡密
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "usedCount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          已使用次数
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  // {
  //   accessorKey: "isBanned",
  //   header: () => <div className="text-right">是否封停使用</div>,
  //   cell: ({ row }) => {
  //     const isBanned = parseFloat(row.getValue("isBanned"))

  //     // todo 弄一个开关
  //     return <div className="text-right font-medium">{isBanned}</div>
  //   },
  // },
  {
    accessorKey: "scriptName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          脚本名称
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: "type",
    header: () => <div className="text-right">卡类单位</div>,
    cell: ({ row }) => {
      const cardType = parseFloat(row.getValue("type"))

      // todo enum 类别
      // cardType=0 就显示为天,1为周,2为月,3为年,4为次数
      const cardTypeMap = new Map([
        [0, "天"],
        [1, "周"],
        [2, "月"],
        [3, "年"],
        [4, "次数"],
      ])
      const cardTypeShow = cardTypeMap.get(cardType)

      return <div className="text-right font-medium">{cardTypeShow}</div>
    },
  },
  {
    accessorKey: "cardValue",
    header: "卡面值",
  },
  {
    accessorKey: "userInfo",
    header: "使用者信息",
  },
  {
    accessorKey: "userIP",
    header: "IP地址",
  },
  {
    accessorKey: "firstUsedTime",
    header: "首次使用时间",
  },
  {
    accessorKey: "lastUsedTime",
    header: "最后使用时间",
  },
  {
    id: "actions",
    cell: ({ row,table }) => {
      const secretKey = row.original
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(secretKey.secret)}
            >
              复制卡密
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">删除卡密</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>确定要删除吗?</AlertDialogTitle>
                    <AlertDialogDescription>
                      删除之后无法恢复
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>取消</AlertDialogCancel>
                    <AlertDialogAction asChild>
                      <Button variant="destructive" onClick={() => table.options.meta?.handleDelete(secretKey.id)}>确认</Button>
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
