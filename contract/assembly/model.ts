import { PersistentUnorderedMap, u128, context } from "near-sdk-as";

/**
 * There are two different models, the Fundraise itself and the Donation.
 * 
 * The Fundraise class contains all the donations and upvotes made, as well as 
 * other important information such as the amount needed for fundraise to be successful and the owner.
 * 
 * The Donation class keeps track of not only of the amount done, but also the wallet who made the donation.
 * 
 * Both classes have the @nearBindgen decorator in order to be serialized.
*/

@nearBindgen
export class Fundraise {
    id: string;
    name: string;
    description: string;
    image: string;
    amountNeeded: u128;
    owner: string;
    donations: Donation[];
    upvotes: string[];
    ended: boolean;
    collected: u128;
    public static fromPayload(payload: Fundraise): Fundraise {
        const fundraise = new Fundraise();
        fundraise.id = payload.id;
        fundraise.name = payload.name;
        fundraise.description = payload.description;
        fundraise.image = payload.image;
        fundraise.amountNeeded = payload.amountNeeded;
        fundraise.owner = context.sender;
        fundraise.donations = [];
        fundraise.upvotes = [];
        fundraise.ended = false;
        return fundraise;
    }

    public upvote(wallet: string): void {
        this.upvotes.push(wallet);
    }
    public donate(donation: Donation): void {
        this.donations.push(donation);
        const currentAmount: u128 = this.collected; 
        this.collected.set(u128.add(currentAmount, donation.amount));
    }

    public end(): void {
        this.ended = true;
    }
}

@nearBindgen
export class Donation {
    wallet: string;
    amount: u128;
}

export const listedFundraises = new PersistentUnorderedMap<string, Fundraise>("LF");
