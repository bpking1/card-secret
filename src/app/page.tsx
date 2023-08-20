"use client"
import { SecretKey, columns } from "./columns"
import { DataTable } from "./data-table"
import { useState, useEffect } from 'react'
import { useToast } from "@/components/ui/use-toast"

function getData(): Promise<SecretKey[]> {
  // Fetch data from your API here.
  const serverApiUrl = "http://lopl.me/api/card";
  return fetch(serverApiUrl)
    .then(response => response.json())
    .then(data => {
      return data;
    }
    );
}

export default function DemoPage() {
  const [cards, setCards] = useState<SecretKey[]>([]);
  useEffect(() => {
    getData().then(data => setCards(data));
  }, []);
  const { toast } = useToast()
  const handleSubmit = (values: any) => {
    // 3. post data to server
    const serverApiUrl = "http://lopl.me/api/card/add";
    fetch(serverApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      // 把valurs.cardType 提交为 values.type
      body: JSON.stringify({ ...values, type: values.cardType })
    }).then(response => response.json())
      .then(data => {
        const newCards = [...cards, data];
        setCards(newCards);
        toast({
          title: "提交成功:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(values, null, 2)}</code>
            </pre>
          ),
        })
      })
      .catch((error) => {
        toast({
          title: "提交失败:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(error, null, 2)}</code>
            </pre>
          ),
        })
      });
  }

  const handleDelete = (id: number) => {
    const serverApiUrl = `http://lopl.me/api/card/delete/${id}`;
    fetch(serverApiUrl, {
      method: 'POST',

    }).then(response => response.statusText)
      .then(data => {
        const newCards = cards.filter((card) => card.id !== id);
        setCards(newCards);
        toast({
          title: "删除成功:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(data, null, 2)}</code>
            </pre>
          ),
        })
      })
      .catch((error) => {
        toast({
          title: "删除失败:",
          description: (
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">{JSON.stringify(error, null, 2)}</code>
            </pre>
          ),
        })
      });
  }

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={cards} handleSubmit={handleSubmit} handleDelete={handleDelete}/>
    </div>
  )
}
