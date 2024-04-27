import {
  fetchQuestCategoryData,
  getQuestsParticipation,
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

describe('getQuestsParticipation', () => {
  beforeEach(() => {
    fetch.mockClear();
  });

  it('should fetch and return data for a valid id', async () => {
    const mockData = [
      {
        name: 'Register a stark domain',
        desc: "In order to create a Starknet Profile, you need a Stark Domain ! This domain will represent you on-chain and is integrated in all the major Starknet apps. You can use it to send & receive money on with Braavos and ArgentX, Access to all the Starknet Quest, being recognized on Starkscan or access to the Stark Name holder's advantages.",
        participants: 3,
      },
      {
        name: 'Follow Starknet Quest on Twitter',
        desc: 'Follow Starknet Quest on Twitter to get updated on their news and rewards for domain holders.',
        participants: 4,
      },
      {
        name: 'Starknet ID Tribe Quiz',
        desc: "Take part in our Starknet ID Tribe Quiz to test your knowledge, and you'll have a chance to win an exclusive Starknet ID Tribe NFT as your reward.",
        quiz_name: 'starknetid',
        participants: 3,
      },
      {
        name: 'Verify your Twitter & Discord',
        desc: 'Verify your social media on your Starknet ID will permit you to access future quests, be careful you need to verify them on the Starknet ID of your domain.',
        participants: 5,
      },
    ];

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockData),
    });

    const result = await getQuestsParticipation(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=1`
    );
    expect(result).toEqual(mockData);
  });

  it('should handle fetch with empty response', async () => {
    const mockResponse = [];
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuestsParticipation(0);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=0`
    );
    expect(result).toEqual(mockResponse);
  });

  it('should handle unexpected response', async () => {
    const mockResponse = {
      error: 500,
      message: 'Error while fetching quest participation',
      data: {},
    };

    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(mockResponse),
    });

    const result = await getQuestsParticipation();

    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=undefined`
    );
    expect(result).toEqual(result);
  });

  it('should handle no response', async () => {
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve(undefined),
    });

    const result = await getQuestsParticipation(1);
    expect(fetch).toHaveBeenCalledWith(
      `${API_URL}/analytics/get_quest_participation?id=1`
    );
    expect(result).toBeUndefined();
  });
});
