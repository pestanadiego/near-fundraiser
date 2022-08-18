import { Donation, Fundraise, listedFundraises } from './model';
import { ContractPromiseBatch, context } from 'near-sdk-core';

/**
 * @dev allows users to create a fundraise
 * @param Fundraise object to create an instance
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
 * @dev helper function that checks if a wallet has already upvoted a fundraise
 * @param fundraise: Fundraise object
 * @param wallet: wallet of the user
 * @returns true if the wallet has already upvoted, false otherwise
 */
function alreadyUpvoted(fundraise: Fundraise, wallet: string): boolean {
    if(fundraise.upvotes && fundraise.upvotes.indexOf(wallet) >= 0) {
        return true;
    }
    return false;
}

/**
 * @dev allows users to upvote a fundraise 
 * @param fundraiserId: the id of the fundraise 
 * @param wallet: wallet of the user
 * @param isDonation: boolean that indicates if the upvote is coming from a donation or not
 */
export function upvote(fundraiserId: string, wallet: string, isDonation: boolean): void {
    const fundraise = getFundraise(fundraiserId);
    if(fundraise == null) {
        throw new Error("Fundraise not found");
    // In case there are upvotes and the wallet already upvoted, an error is throwed
    } else if(alreadyUpvoted(fundraise, wallet)) {
        if(!isDonation) {
            throw new Error("Already upvoted");
        }    
    } else {
        // When a Fundraise instance is initializated, it does not have the Upvotes Array created.
        if(fundraise.upvotes === null) {
            fundraise.upvotes = [];
        }
        fundraise.upvotes.push(wallet);
        listedFundraises.set(fundraise.id, fundraise); 
    }
}

/**
 * @dev allows users to donate to a fundraise 
 * @param fundraiserId: the id of the fundraise 
 * @param donation: a Donation object that contains the wallet and the amount of the donation
 */
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
    listedFundraises.set(fundraise.id, fundraise);
    // By donating, it automatically counts an upvote
    upvote(fundraiserId, donation.wallet, true);
}