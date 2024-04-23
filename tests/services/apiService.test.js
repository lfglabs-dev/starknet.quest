import { fetchQuestCategoryData, getQuestBoostClaimParams } from "@services/apiService";

const API_URL = process.env.NEXT_PUBLIC_API_LINK;

global.fetch = jest.fn();

describe("fetchQuestCategoryData function", () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it("should fetch and return data for a valid category name", async () => {
    const mockData = {
      name: "Quest Name",
      title: "Quest title",
      desc: "Quests description.",
      img_url: "braavos/category.webp",
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchQuestCategoryData("Quest Name");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_category?name=Quest Name`
    );
    expect(result).toEqual(mockData);
  });

  it("should handle fetch errors gracefully", async () => {
    const mockResponse = "Category not found";
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchQuestCategoryData("InvalidCategory");
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_category?name=InvalidCategory`
    );
    expect(result).toEqual(mockResponse);
  });
});

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
  
         const result = await getQuestBoostClaimParams ("string", "address");
         expect(fetch).toHaveBeenCalledWith(
          `${API_URL}/boost/get_claim_params?boost_id=string&addr=address`
         );
         expect(result).toEqual(mockData);
  });
  
  it("should handle fetch errrors in unexpected format", async () => {
      const mockResponse = "Boost with id 456 not found";
  
      fetch.mockResolvedValueOnce({
       json: () => Promise.resolve(mockResponse),
     });
  
     const result = await getQuestBoostClaimParams ("456", "566");
     expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_claim_params?boost_id=456&addr=566`
     );
     expect(result).toEqual(mockResponse);
  })
  
  
  it("should handle fetch with No Response ", async () => {
      const mockResponse = "Failed to deserialize query string: invalid digit found in string";
  
      fetch.mockResolvedValueOnce({
       json: () => Promise.resolve(mockResponse),
     });
  
     const result = await getQuestBoostClaimParams ("string", "566");
     expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_claim_params?boost_id=string&addr=566`
     );
     expect(result).toEqual(mockResponse);
  })
  
  })