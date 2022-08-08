import { PersistentUnorderedMap, u128, context } from "near-sdk-as";

/**
 * There are two different models, the Fundraise itself and the Donation.
 * 
 * The Fundraise class containts all the donations and upvotes made, as well as 
 * other important information such as the amount needed to donate and the owner.
 * 
 * The Donation clas keeps track not only of the amount done, but also the wallet who made the donation.
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
    public static fromPayload(payload: Fundraise): Fundraise {
        const fundraise = new Fundraise();
        fundraise.id = payload.id;
        fundraise.name = payload.name;
        fundraise.description = payload.description;
        fundraise.image = payload.image;
        fundraise.amountNeeded = payload.amountNeeded;
        fundraise.owner = context.sender;
        return fundraise;
    }
}

@nearBindgen
export class Donation {
    wallet: string;
    amount: u128;
}

export const listedFundraises = new PersistentUnorderedMap<string, Fundraise>("LF");
