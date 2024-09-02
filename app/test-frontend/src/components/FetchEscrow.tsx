import { useEffect, useState } from "react"
import { testAppPda, escrowPDA, getProgram } from "../anchor/setup"
import { getAccount, getAssociatedTokenAddress } from "@solana/spl-token"
import { PublicKey } from "@solana/web3.js"
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { AnchorProvider, Program } from "@coral-xyz/anchor"

export default function FetchEscrow() {
  const [escrowData, setEscrowData] = useState<any>(null)

  const getEscowAccount = async () => {
    const program = getProgram()
    // const escrowAta = await getAssociatedTokenAddress(
    //   new PublicKey("C1Q4tc5mAMxgSdtrHiva6tNWdw9iCgUpd2GhT8BF3QGz"), // USDC token
    //   escrowPDA,
    //   true
    // )

    // return await getAccount(
    //   program.provider.connection,
    //   escrowAta
    // )
  }

  useEffect(() => {
    // Fetch escrow balance
    const data = getEscowAccount()
    console.log("fetching escrow account", data)
    setEscrowData(data)
  }, [])

  useEffect(() => {
    console.log("wat escrow", escrowData)
  }, [escrowData])

  // Render the deposited amount
  return <p className="text-lg">Amount Escrowed: {escrowData?.amount?.toString()}</p>
}