import { AnchorProvider, Program } from "@coral-xyz/anchor"
import TestAppPdaIdl from "./idl/test_app_pda.json"
import { TestAppPda } from "./idl/type"
import { PublicKey } from "@solana/web3.js"
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"
import { Buffer } from "buffer"

export const testAppPda = TestAppPdaIdl as TestAppPda
export const PROGRAM_ID = new PublicKey(testAppPda.address)
console.log("program id", PROGRAM_ID.toBase58())

export const getProgram = () => {
  console.log("getProgram started")
  const wallet = useAnchorWallet()
  console.log("wallet", wallet)

  const { connection } = useConnection()
  console.log("connection", connection)

  const provider = new AnchorProvider(connection, wallet as AnchorWallet, {})
  console.log("provider", provider)

  return new Program(testAppPda, provider)
}

export const [escrowPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("escrow")],
  new PublicKey("BdVwc1n1Ux2afUrcz189iwSmVmWgGtPCxuoGG3EDiw7S"),
)
console.log("escrow pda", escrowPDA.toBase58())
