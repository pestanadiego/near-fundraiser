import { Donation, Fundraise, listedFundraises } from './model';
import { ContractPromiseBatch, context } from 'near-sdk-core';


/**
 * @dev allows users to create a Fundraise
 * @param fundraise Object of values to create a new instance of Fundraise
 */
export function setFundraise(fundraise: Fundraise): void {
    let storedFundraise = listedFundraises.get(fundraise.id);
    if(storedFundraise !== null) {
        throw new Error(`A fundraise with ${fundraise.id} already exists`);
    }
    listedFundraises.set(fundraise.id, Fundraise.fromPayload(fundraise));
}

export function getFundraise(id: string): Fundraise | null {
    return listedFundraises.get(id);
}

export function getFundraises(): Fundraise[] {
    return listedFundraises.values();
}

/**
 * @dev allows user to upvote a fundraise
 * @param fundraiseId id of fundraise
 */
export function upvote(fundraiseId: string): void {
    const fundraise = getFundraise(fundraiseId);
    if(fundraise == null) {
        throw new Error("Fundraise not found");
    // In case there are upvotes and the wallet already upvoted, an error is throwed
    }
    assert(fundraise.ended == false, "Fundraise is over");
    const wallet: string = context.sender.toString();
    assert(fundraise.upvotes.indexOf(wallet) == -1, "Already Upvoted");
    fundraise.upvote(wallet);
    listedFundraises.set(fundraise.id, fundraise); 
}

/**
 * @dev allows users to make a donation to a campaign
 * @param fundraiseId id of fundraise
 * @param donation Object containing values necessary to create an instance of Donation
 * @notice If user hasn't upvoted campaign yet, by donating, they automatically upvote fundraise
 */
export function makeDonation(fundraiseId: string, donation: Donation): void {
    const fundraise = getFundraise(fundraiseId);
    if(fundraise == null) {
        throw new Error("Fundraise not found");
    }
    assert(fundraise.ended == false, "Fundraise is over");
    assert(donation.wallet.toString() != "", "Invalid wallet id");
    assert(donation.amount.toString() == context.attachedDeposit.toString(), "Amount donated has to match the attached Deposit");
    // donations is pushed onto the donations array
    fundraise.donate(donation);
    // By donating, it automatically counts an upvote
    // If wallet hasn't upvoted yet, upvote for wallet is added
    if(fundraise.upvotes.indexOf(donation.wallet) == -1){
        fundraise.upvote(donation.wallet);
    }

    listedFundraises.set(fundraise.id, fundraise);
}


/**
 * @dev allows the fundraise's owner to end the fundraise
 * @param fundraiseId id of fundraise
 * @notice fundraise can only be ended after amount collected is greater or equal to the amount Needed
 */
export function endFundraise(fundraiseId: string): void {
    const fundraise = getFundraise(fundraiseId);
    if(fundraise == null) {
        throw new Error("Fundraise not found");
    }

    assert(fundraise.owner.toString() == context.sender.toString(), "Only the owner of the fundraise can end the fundraise");
    assert(fundraise.ended == false, "Fundraise is over");
    assert(fundraise.collected >= fundraise.amountNeeded, "Not enough collected yet from the fundraise");
    ContractPromiseBatch.create(fundraise.owner).transfer(fundraise.collected);
    fundraise.end();
}