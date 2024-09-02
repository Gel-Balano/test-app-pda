import { AnchorProvider, Idl, Program } from "@coral-xyz/anchor"
import TestAppPdaIdl from "./idl/test_app_pda.json"
import { PublicKey } from "@solana/web3.js"
import { AnchorWallet, useAnchorWallet, useConnection } from "@solana/wallet-adapter-react"

const testAppPda = TestAppPdaIdl as Idl
export const PROGRAM_ID = new PublicKey(testAppPda.address)
console.log("program id", PROGRAM_ID.toBase58())

const { connection } = useConnection()
console.log("connection", connection)

const wallet = useAnchorWallet()
console.log("wallet", wallet)

const provider = new AnchorProvider(connection, wallet as AnchorWallet, {})
console.log("Provider", provider)

export const program = new Program(testAppPda, provider)

console.log("program", program)
export const [escrowPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("escrow")],
  program.programId,
)
console.log("pda", escrowPDA)
