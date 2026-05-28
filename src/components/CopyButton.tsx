import { useState } from "react"
import { Check, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false)

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(text)

      setCopied(true)

      setTimeout(() => {
        setCopied(false)
      }, 1500)

    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Button
      variant={copied ? "default" : "outline"}
      size="xs"
      onClick={copyToClipboard}
      className={copied ? "bg-green-600 hover:bg-green-600" : ""}
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </Button>
  )
}
