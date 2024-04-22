import { getQuestBoostClaimParams } from "@services/apiService";
const API_URL = process.env.NEXT_PUBLIC_API_LINK;

global.fetch = jest.fn();

describe("getQuestBoostClaimParams function", () =>  {

beforeEach(() => {
    fetch.mockClear();
}  
);

it("should fetch and return data for a valid  id and address", async () => {
       const mockData = ["string", "string"]; 
       fetch.mockResolvedValueOnce({
        json: () => Promise.resolve(mockData),
      });
    //    fetch.getQuestBoostClaimParams ({
    //     json: () => Promise.resolve(mockData),
    //    });

       const result = await getQuestBoostClaimParams ("string", "address");
       expect(fetch).toHaveBeenCalledWith(
        `${API_URL}/boost/get_claim_params?boost_id=string&addr=address`
       );
       expect(result).toEqual(mockData);
})


})



