import { useEffect, useState } from "react"
import { useConnection } from "@solana/wallet-adapter-react"
import { program, escrowPDA } from "../anchor/setup"

export default function FetchEscrow() {
  const { connection } = useConnection()
  const [escrowData, setEscrowData] = useState<any>(null)

  useEffect(() => {
    // Fetch escrow balance
    const escrow = program.account.escrow.fetch(escrowPDA)
  }, [program])

  // Render the deposited amount
  return <p className="text-lg">Count: {escrowData?.count?.toString()}</p>
}