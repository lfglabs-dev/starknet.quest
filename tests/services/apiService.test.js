import { fetchQuestCategoryData, getTasksByQuestId } from "@services/apiService";

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

describe("getTasksByQuestId function", () => {
  beforeEach(() => {
    fetch.mockClear()
  });

  it("should handle when api returns no response", async () => {
    const mockResponse = null;
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    const result = await getTasksByQuestId({ questId: '1', address: '2'});
    expect(result).toEqual(mockResponse)
  });

  it("should handle when api return response in unexpected format", async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve("Unexpected Format")
    })

    const result = await getTasksByQuestId({ questId: '1', address: '2' })
    expect(result).not.toEqual(expect.any(Array))
  });

  it("should handle undefined and null values", async () => {
    const mockResponse = undefined

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    })

    let result = await getTasksByQuestId({ address: '2' })
    
    expect(result).toBeUndefined()

    result = await getTasksByQuestId({ questId: null, address: '2' })
    
    expect(result).toBeUndefined()

    result = await getTasksByQuestId({ questId: '1', })
    
    expect(result).toBeUndefined()

    result = await getTasksByQuestId({ questId: '1', address: null })
    
    expect(result).toBeUndefined()

    result = await getTasksByQuestId({  })
    
    expect(result).toBeUndefined()

    result = await getTasksByQuestId({ questId: null, address: null })
    
    expect(result).toBeUndefined()
  });

  it("should fetch and return data for a valid task", async () => {
    const mockData = [
      {
        id: "Task Id",
        quest_id: "Quest Id",
        name: "Task Name",
        href: "Task Link",
        cta: "Task CTA",
        verify_endpoint: "Task Verify Endpoint",
        verify_endpoint_type: "Task Verify Endpoint Type",
        verify_redirect: "Task Verify Redirect",
        desc: "Task Description",
        completed: "Task Completed",
        quiz_name: "Quiz Name"
      }
    ]
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    })

    const result = await getTasksByQuestId({questId:"1", address:"2"});
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_tasks?quest_id=1&addr=2`
    );
    expect(result).toEqual(mockData)
  });
})
