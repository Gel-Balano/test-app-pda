import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { TestAppPda } from "../target/types/test_app_pda";
import { Keypair, PublicKey } from "@solana/web3.js";
import { readFileSync } from 'fs'
import { homedir } from 'os'
import { resolve } from 'path'
import { createMint, getOrCreateAssociatedTokenAccount, mintTo } from "@solana/spl-token";
import { expect } from "chai";

function loadKeypair(filePath: string): Keypair {
  const resolvedPath = filePath.startsWith('~')
    ? filePath.replace('~', homedir())
    : filePath
  const absolutePath = resolve(resolvedPath)
  const keypairString = readFileSync(absolutePath, 'utf-8')
  const keypairBuffer = Buffer.from(JSON.parse(keypairString))
  return Keypair.fromSecretKey(keypairBuffer)
}
describe("test-app-pda", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TestAppPda as Program<TestAppPda>;
  const authority = loadKeypair('~/.config/solana/id.json')

  let tokenMint: PublicKey
  let ownerAta: PublicKey

  before(async () => {
    tokenMint = await createMint(
      program.provider.connection,
      authority,
      authority.publicKey,
      authority.publicKey,
      9
    )

    ownerAta = (
      await getOrCreateAssociatedTokenAccount(
        program.provider.connection,
        authority,
        tokenMint,
        authority.publicKey
      )
    ).address

    await Promise.all([
      mintTo(
        program.provider.connection,
        authority,
        tokenMint,
        ownerAta,
        authority,
        1000 * 10 ** 9
      )])
  })

  it("Is initialized!", async () => {
    // Add your test here.
    const [escrowPda] = PublicKey.findProgramAddressSync(
      [Buffer.from("escrow"), authority.publicKey.toBuffer()],
      program.programId);

    const ix = program.methods.depositEscrow({amount: new BN(1000 * 10 ** 9)}).rpc();
    console.log('wat', ix)

    const escrow = await program.account.escrow.fetch(escrowPda)
    expect(escrow.owner.equals(authority.publicKey)).to.be.true
  });
});
