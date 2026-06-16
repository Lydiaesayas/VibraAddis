function parseSocialUrl(rawUrl) {
  const url = rawUrl.split("?")[0].replace(/\/$/, "");

  const tiktokMatch = url.match(/tiktok\.com\/@([^/]+)\/video\/(\d+)/i);
  if (tiktokMatch) {
    return {
      platform: "tiktok",
      type: "video",
      externalId: tiktokMatch[2],
      handle: tiktokMatch[1].toLowerCase(),
      cleanUrl: `https://www.tiktok.com/@${tiktokMatch[1]}/video/${tiktokMatch[2]}`,
    };
  }

  const reelMatch = url.match(/instagram\.com\/reel\/([^/]+)/i);
  if (reelMatch) {
    return {
      platform: "instagram",
      type: "reel",
      externalId: reelMatch[1],
      handle: null,
      cleanUrl: `https://www.instagram.com/reel/${reelMatch[1]}/`,
    };
  }

  const postMatch = url.match(/instagram\.com\/p\/([^/]+)/i);
  if (postMatch) {
    return {
      platform: "instagram",
      type: "post",
      externalId: postMatch[1],
      handle: null,
      cleanUrl: `https://www.instagram.com/p/${postMatch[1]}/`,
    };
  }

  const storyMatch = url.match(/instagram\.com\/stories\/([^/]+)/i);
  if (storyMatch) {
    return {
      platform: "instagram",
      type: "story",
      externalId: url.split("/").pop(),
      handle: storyMatch[1].toLowerCase(),
      cleanUrl: rawUrl.split("?")[0],
    };
  }

  return {
    platform: "unknown",
    type: "link",
    externalId: url,
    handle: null,
    cleanUrl: url,
  };
}

function handleToVenueName(handle) {
  const map = {
    blackroselounge: "Black Rose Lounge",
    thecageaddis: "The Cage Addis",
    passwordlounge: "Password Lounge",
    passwordloungeaddis: "Password Lounge",
    vibraaddis: "VibraAddis",
  };
  return map[handle?.toLowerCase()] || null;
}

function normalizeVenueName(name) {
  return name.trim().toLowerCase().replace(/\s+/g, " ");
}

module.exports = { parseSocialUrl, handleToVenueName, normalizeVenueName };
