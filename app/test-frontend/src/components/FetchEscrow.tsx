import { useEffect, useState } from "react"
import { useEscrowAddress, useProgram } from "../anchor/setup"
import { getAccount, getAssociatedTokenAddressSync, TOKEN_PROGRAM_ID } from "@solana/spl-token"
import { PublicKey } from "@solana/web3.js"
import { AnchorWallet, useAnchorWallet, useConnection, useWallet } from "@solana/wallet-adapter-react"
import { AnchorProvider, Program } from "@coral-xyz/anchor"
import React from "react"

export default function FetchEscrow() {
  const [escrowData, setEscrowData] = useState<any>(null)
  const program = useProgram()
  console.log("program", program.programId.toBase58())

  // const escrowPDA = useEscrowAddress()
  // console.log("escrowPDA", escrowPDA?.toBase58())

  // if (escrowPDA === null) return null;

  // const mintAta = getAssociatedTokenAddressSync(
  //   new PublicKey("Gh9ZwEmdLJ8DscKNTkTqPbNwLNNBjuSzaG9Vp2KGtKJr"), // USDC token
  //   escrowPDA,
  //   true
  // )
  // console.log("mintAta", mintAta.toBase58())

  // getAccount(
  //   program.provider.connection,
  //   mintAta
  // ).then((account) => {
  //   console.log("fetching escrow account", account)
  //   setEscrowData(account)
  // })

  useEffect(() => {
    const getToken = async() => {
      if (!program?.provider?.publicKey) return null
      if (!program?.provider?.connection?.getTokenAccountsByOwner) return null
      const connection = program.provider.connection
      const tokenAccounts = await connection.getTokenAccountsByOwner(program.provider.publicKey, {
        programId: TOKEN_PROGRAM_ID
      })
      console.log(tokenAccounts.value.map((account) => account.pubkey.toBase58()))
      // address token - read metadata
    }
    void getToken()
    console.log("pp", program)
  }, [program])

  // if (!wallet.publicKey) return null
  // Render the deposited amount
  return <p className="text-lg">Amount Escrowed: {escrowData?.amount?.toString()}</p>
}
