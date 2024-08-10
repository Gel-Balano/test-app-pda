import * as anchor from "@coral-xyz/anchor";
import { BN, Program } from "@coral-xyz/anchor";
import { TestAppPda } from "../target/types/test_app_pda";
import { utf8 } from "@coral-xyz/anchor/dist/cjs/utils/bytes";
import { assert } from "chai";

describe("test-app-pda", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.TestAppPda as Program<TestAppPda>;

  it("Is initialized!", async () => {
    // Add your test here.
    const publicKey = anchor.AnchorProvider.local().wallet.publicKey;
    const toWallet: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const [escrowPDA] = await anchor.web3.PublicKey.findProgramAddressSync([
        utf8.encode('escrow'),
        publicKey.toBuffer(),
        toWallet.publicKey.toBuffer()
      ],
      program.programId
    );
    console.log("escrowPDA", escrowPDA);
    const initAccounts = {
      from: publicKey,
      to: toWallet.publicKey,
      systemProgram:  anchor.web3.SystemProgram.programId,
      escrow: escrowPDA
    };
    await program.methods.createEscrow(new BN(32)).accounts(initAccounts).rpc();
    const escrowAccount = await program.account.escrowAccount.fetch(escrowPDA);
    console.log(escrowAccount);
    assert.equal(escrowAccount.amount.toNumber(), 32);
    assert.isTrue(escrowAccount.from.equals(publicKey));
    assert.isTrue(escrowAccount.to.equals(toWallet.publicKey));
  });
});
