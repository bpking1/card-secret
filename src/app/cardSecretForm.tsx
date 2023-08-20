"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import * as z from "zod"
import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover"
import { useToast } from "@/components/ui/use-toast"
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
} from "@/components/ui/command"

const cardType = [
    { label: "天", value: 0 },
    { label: "周", value: 1 },
    { label: "月", value: 2 },
    { label: "年", value: 3 },
    { label: "次数", value: 4 },
] as const

const formSchema = z.object({
    cardValue: z
        .string()
        .refine((value) => {
            const parsedValue = parseInt(value, 10);
            return parsedValue > 0 && String(parsedValue) === value;
        }, {
            message: '面值必须大于0',
        }),
    cardType: z.number({
        required_error: "请选择卡密类型",
    }),
    scriptName: z.string({
        required_error: "请输入脚本名称",
    }),
    userInfo: z.string({
        required_error: "请输入用户信息",
    }),
})

export function CardSecretForm({handleSubmit} : {handleSubmit: any}) {
    const { toast } = useToast()
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            cardType: 0,
            cardValue: "1",
            scriptName: "未填写",
            userInfo: "未填写",
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof formSchema>) {
        // 3. post data to server
        handleSubmit(values);
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

                <FormField
                    control={form.control}
                    name="scriptName"
                    render={({ field }) => (
                        <FormItem>

                            <FormLabel>脚本名称</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )} />
                <FormField
                    control={form.control}
                    name="userInfo"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>用户信息</FormLabel>
                            <FormControl>
                                <Input  {...field} />
                            </FormControl>
                            <FormDescription>
                                填写用户信息,备注
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )} />
                <FormField
                    control={form.control}
                    name="cardValue"
                    render={({ field }) => (
                        <>
                            <FormItem>
                                <FormLabel>卡密面值</FormLabel>
                                <FormControl>
                                    <Input {...field} />
                                </FormControl>
                                <FormDescription>
                                    输入卡密面值
                                </FormDescription>
                                <FormMessage />
                            </FormItem>

                        </>
                    )}
                />
                <FormField
                    control={form.control}
                    name="cardType"
                    render={({ field }) => (
                        <FormItem className="flex flex-col">
                            <FormLabel>卡密类型</FormLabel>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <FormControl>
                                        <Button
                                            variant="outline"
                                            role="combobox"
                                            className={cn(
                                                "w-[200px] justify-between",
                                                !field.value && "text-muted-foreground"
                                            )}
                                        >
                                            {field.value ?
                                                cardType.find(
                                                    (cardType) => cardType.value === field.value
                                                )?.label
                                                : "天"}
                                            <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                        </Button>
                                    </FormControl>
                                </PopoverTrigger>
                                <PopoverContent className="w-[200px] p-0">
                                    <Command>
                                        <CommandInput
                                            placeholder="搜索.."
                                            className="h-9"
                                        />
                                        <CommandEmpty>未找到</CommandEmpty>
                                        <CommandGroup>
                                            {cardType.map((cardType) => (
                                                <CommandItem
                                                    value={cardType.label}
                                                    key={cardType.value}
                                                    onSelect={() => {
                                                        form.setValue("cardType", cardType.value)
                                                    }}
                                                >
                                                    {cardType.label}
                                                    <CheckIcon
                                                        className={cn(
                                                            "ml-auto h-4 w-4",
                                                            cardType.value === field.value
                                                                ? "opacity-100"
                                                                : "opacity-0"
                                                        )}
                                                    />
                                                </CommandItem>
                                            ))}
                                        </CommandGroup>
                                    </Command>
                                </PopoverContent>
                            </Popover>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">提交</Button>
            </form>
        </Form>
    )
}
