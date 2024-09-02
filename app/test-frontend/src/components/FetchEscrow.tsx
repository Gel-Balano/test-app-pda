import { useEffect, useState } from "react"
// import { useConnection } from "@solana/wallet-adapter-react"
import { program, escrowPDA } from "../anchor/setup"

export default function FetchEscrow() {
  // const { connection } = useConnection()
  const [escrowData, setEscrowData] = useState<any>(null)

  useEffect(() => {
    // Fetch escrow balance
    program.account.escrow.fetch(escrowPDA).then(data => {
      console.log("wat", data)
      setEscrowData(data)
    })

    // to-do get the balance from escrow
  }, [program])

  // Render the deposited amount
  return <p className="text-lg">Amount Escrowed: {escrowData?.amount?.toString()}</p>
}