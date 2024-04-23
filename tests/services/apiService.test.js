import {
  fetchQuestCategoryData,
  getCompletedBoosts
} from '@services/apiService';

const API_URL = process.env.NEXT_PUBLIC_API_LINK;

global.fetch = jest.fn();

describe('fetchQuestCategoryData function', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch and return data for a valid category name', async () => {
    const mockData = {
      name: 'Quest Name',
      title: 'Quest title',
      desc: 'Quests description.',
      img_url: 'braavos/category.webp',
    };
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await fetchQuestCategoryData('Quest Name');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_category?name=Quest Name`
    );
    expect(result).toEqual(mockData);
  });

  it('should handle fetch errors gracefully', async () => {
    const mockResponse = 'Category not found';
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await fetchQuestCategoryData('InvalidCategory');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/get_quest_category?name=InvalidCategory`
    );
    expect(result).toEqual(mockResponse);
  });
});

describe('getCompletedBoosts function', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch and return data for a valid address', async () => {
    const mockDataResponse = [23, 104, 24, 105];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataResponse),
    });

    const result = await getCompletedBoosts('5645');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_completed_boosts?addr=5645`
    );

    expect(result).toEqual(mockDataResponse);
  });

  it('should fetch and return data in an invalid format', async () => {
    const mockDataResponse =
      'Failed to deserialize query string: invalid character';
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockDataResponse),
    });

    const result = await getCompletedBoosts('string');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_completed_boosts?addr=string`
    );

    expect(result).toEqual(mockDataResponse);
  });

  it('should handle fetch with handle error gracefully', async () => {
    const mockResponse = 'Boost with id 5645wdhefbhrdkf568jur not found';

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getCompletedBoosts('5645wdhefbhrdkf568jur');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_completed_boosts?addr=5645wdhefbhrdkf568jur`
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle fetch with empty response', async () => {
    const mockResponse = [];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getCompletedBoosts('5645');
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/boost/get_completed_boosts?addr=5645`
    );
    expect(result).toEqual(mockResponse);
  });
});
