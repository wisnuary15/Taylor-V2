import {
  fetch
} from "undici";
async function getUserInfo(margs, type) {
  try {
    let id;
    let usernamesData;
    if (type === "name") {
      const usernamesResponse = await fetch("https://users.roblox.com/v1/usernames/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          usernames: [margs.join(" ")]
        }),
      });
      usernamesData = await usernamesResponse.json();
      id = usernamesData.data[0]?.id;
    } else if (type === "id") {
      id = margs;
    }
    const userResponse = await fetch("https://users.roblox.com/v1/users/" + id);
    const userData = await userResponse.json();
    const presenceResponse = await fetch("https://presence.roblox.com/v1/presence/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        userIds: [parseInt(id)]
      }),
    });
    const presenceData = await presenceResponse.json();
    const lastOnline = presenceData.userPresences[0]?.lastOnline;
    const followersResponse = await fetch("https://friends.roblox.com/v1/users/" + id + "/followers/count");
    const followingsResponse = await fetch("https://friends.roblox.com/v1/users/" + id + "/followings/count");
    const friendsResponse = await fetch("https://friends.roblox.com/v1/users/" + id + "/friends/count");
    const robloxBadgesResponse = await fetch("https://accountinformation.roblox.com/v1/users/" + id +
      "/roblox-badges");
    const robloxBadgesData = await robloxBadgesResponse.json();
    const groupsResponse = await fetch("https://groups.roblox.com/v1/users/" + id + "/groups/roles");
    const groupsData = await groupsResponse.json();
    const roproInfoResponse = await fetch("https://api.ropro.io/getUserInfoTest.php?userid=" + id);
    const roproInfoData = await roproInfoResponse.json();
    const usernameHistoryResponse = await fetch("https://users.roblox.com/v1/users/" + id +
      "/username-history?limit=100&sortOrder=Desc");
    let usernameHistoryData = await usernameHistoryResponse.json();
    while (usernameHistoryData.nextPageCursor) {
      const nextPageResponse = await fetch("https://users.roblox.com/v1/users/" + id +
        "/username-history?limit=100&sortOrder=Desc&cursor=" + usernameHistoryData.nextPageCursor);
      const nextPageData = await nextPageResponse.json();
      usernameHistoryData = nextPageData;
    }
    const tradeInfoResponse = await fetch("https://rblx.trade/api/v1/user/profile?userId=" + id);
    const tradeInfoData = await tradeInfoResponse.json();
    const thumbnailResponse = await fetch("https://thumbnails.roblox.com/v1/users/avatar?userIds=" + id +
      "&size=150x150&format=Png&isCircular=false");
    const thumbnailData = await thumbnailResponse.json();
    const premiumStatusResponse = await fetch("https://premiumfeatures.roblox.com/v1/users/" + id +
      "/validate-membership");
    const premiumStatusData = await premiumStatusResponse.json();
    const friendsListResponse = await fetch("https://friends.roblox.com/v1/users/" + id + "/friends");
    const friendsListData = await friendsListResponse.json();
    return {
      usernames: usernamesData.data,
      user: userData,
      presence: {
        lastOnline
      },
      followers: await followersResponse.json(),
      followings: await followingsResponse.json(),
      friends: await friendsResponse.json(),
      robloxBadges: robloxBadgesData,
      groups: groupsData.data,
      roproInfo: roproInfoData,
      usernameHistory: usernameHistoryData,
      tradeInfo: tradeInfoData,
      thumbnail: thumbnailData.data[0],
      premiumStatus: premiumStatusData,
      friendsList: friendsListData.data,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}
export {
  getUserInfo
};
