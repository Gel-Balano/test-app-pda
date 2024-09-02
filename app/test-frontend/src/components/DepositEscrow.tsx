import { useEffect } from "react"
// import { useConnection } from "@solana/wallet-adapter-react"
import { program, escrowPDA } from "../anchor/setup"

export default function FetchEscrow() {
  // const { connection } = useConnection()
  // const [escrowData, setEscrowData] = useState<any>(null)

  const handleDeposit = () => {
    // Deposit the amount into the escrow account
    // Update the escrowData state with the new balance
  }

  useEffect(() => {
    program.account.escrow.fetch(escrowPDA).then(data => {
      console.log("wat", data)
    })
  }, [program])

  // Render the deposited amount
  return <form action="#!" onSubmit={handleDeposit}>
    <label>Enter Amount</label>
    <input type="number" />
    <button type="submit">Deposit</button>
  </form>
}