export const ExploreImageBanner = [
  {
    url: "https://images.pexels.com/photos/12801/pexels-photo-12801.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "THE BIG DECISION THAT SET UPWIN",
    date: "Sun 21/08/24",
    time: "6:00 PM",
    game: "Formula 1",
  },
  {
    url: "https://images.pexels.com/photos/4747326/pexels-photo-4747326.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "THRILLING LAST BALL VICTORY",
    date: "Thu 18/08/24",
    time: "8:30 PM",
    game: "Cricket",
  },
  {
    url: "https://images.pexels.com/photos/1884574/pexels-photo-1884574.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "A NEW ERA OF FOOTBALL",
    date: "Fri 19/08/24",
    time: "7:00 PM",
    game: "Football",
  },
  {
    url: "https://images.pexels.com/photos/974502/pexels-photo-974502.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
    title: "BASKETBALL CHAMPIONS RISE",
    date: "Sat 20/08/24",
    time: "9:15 PM",
    game: "Basketball",
  },
];

export const hashtagData = [
  { id: 1, hashtag: "#INDvsNZ", postsCount: "44.2k" },
  { id: 2, hashtag: "#Ferrari", postsCount: "85.2k" },
  { id: 3, hashtag: "#BMW", postsCount: "2.7k" },
  { id: 4, hashtag: "#Lamborghini", postsCount: "7k" },
  { id: 5, hashtag: "#Football", postsCount: "23k" },
  { id: 6, hashtag: "#Badminton", postsCount: "2k" },
  { id: 7, hashtag: "#IPL", postsCount: "70k" },
  { id: 8, hashtag: "#Rugby", postsCount: "1k" },
  { id: 9, hashtag: "#TableTennis", postsCount: "4k" },
  { id: 10, hashtag: "#RCBvsCSK", postsCount: "100k" },
  { id: 11, hashtag: "#Formula1", postsCount: "120k" },
  { id: 12, hashtag: "#USOpen", postsCount: "15k" },
  { id: 13, hashtag: "#CricketWorldCup", postsCount: "300k" },
  { id: 14, hashtag: "#MotoGP", postsCount: "12.5k" },
  { id: 15, hashtag: "#Euro2024", postsCount: "95k" },
  { id: 16, hashtag: "#SuperBowl", postsCount: "250k" },
  { id: 17, hashtag: "#Olympics", postsCount: "500k" },
  { id: 18, hashtag: "#NBAFinals", postsCount: "200k" },
  { id: 19, hashtag: "#Wimbledon", postsCount: "180k" },
  { id: 20, hashtag: "#ChampionsLeague", postsCount: "350k" },
];

export const fetchSwipper = async () => {
  try {
    const baseUrl = process.env.EXPO_BASE_URL;
    const response = await fetch(
      `http://192.168.70.11:3000/api/v1/exploreNews/get-trending-swipper`
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const json = await response.json();

    if (!json.data || !json.data.swipperSlides) {
      throw new Error("Invalid API response structure");
    }

    return json.data.swipperSlides;
  } catch (error) {
    console.error("Error fetching swipper slides:", error);
    return []; // Return an empty array to avoid breaking the UI
  }
};
