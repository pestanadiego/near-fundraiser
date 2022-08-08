import { Donation, Fundraise, listedFundraises } from './model';
import { ContractPromiseBatch, context } from 'near-sdk-core';

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

export function upvote(fundraiserId: string, wallet: string): void {
    const fundraise = getFundraise(fundraiserId);
    if(fundraise == null) {
        throw new Error("Fundraise not found");
    // In case there are upvotes and the wallet already upvoted, an error is throwed
    } else if(fundraise.upvotes && fundraise.upvotes.indexOf(wallet) >= 0) {
        throw new Error("Already upvoted");
    }
    // When a Fundraise instance is initializated, it does not have the Upvotes Array created.
    if(fundraise.upvotes === null) {
        fundraise.upvotes = [];
    }
    fundraise.upvotes.push(wallet);
    listedFundraises.set(fundraise.id, fundraise); 
}

export function makeDonation(fundraiserId: string, donation: Donation): void {
    const fundraise = getFundraise(fundraiserId);
    if(fundraise == null) {
        throw new Error("Fundraise not found");
    }
    ContractPromiseBatch.create(fundraise.owner).transfer(context.attachedDeposit);
    // When a Fundraise instance is initializated, it does not have the Donations Array created.
    if(fundraise.donations === null) {
        fundraise.donations = [];
    }
    fundraise.donations.push(donation);
    // By donating, it automatically counts an upvote
    let alreadyUpvoted = false;
    // In case the Upvotes Array has not been already created
    if(fundraise.upvotes === null) {
        fundraise.upvotes = [];
    // If the wallet donating has already upvoted the fundraise, it does not add a new upvote.
    } else if(fundraise.upvotes && fundraise.upvotes.indexOf(donation.wallet) >= 0) {
        alreadyUpvoted = true;
    }
    if(!alreadyUpvoted) {
        fundraise.upvotes.push(donation.wallet);
    }
    listedFundraises.set(fundraise.id, fundraise);
}