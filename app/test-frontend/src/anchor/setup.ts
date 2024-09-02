import { Program } from "@coral-xyz/anchor"
import { TestAppPda } from "./idl/type"
import TestAppPdaIdl from "./idl/test_app_pda.json"
import { Keypair, PublicKey } from "@solana/web3.js"

const testAppPda = TestAppPdaIdl as TestAppPda
export const program = new Program<TestAppPda>(testAppPda)
const idKeypair = Keypair.generate()
export const [escrowPDA] = PublicKey.findProgramAddressSync(
  [Buffer.from("escrow"), idKeypair.publicKey.toBytes()],
  program.programId,
)