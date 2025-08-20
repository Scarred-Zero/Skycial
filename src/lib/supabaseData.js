import { supabase } from "@/lib/customSupabaseClient";

/**
 * Maps camelCase fields from your app to the snake_case columns in the profiles table.
 * This is a helper function to keep naming conventions consistent.
 */
const mapToProfileColumns = (partial) => {
  const payload = {};
  if ("fullName" in partial) payload.full_name = partial.fullName;
  if ("avatarUrl" in partial) payload.avatar_url = partial.avatarUrl;
  if ("zodiacSign" in partial) payload.zodiac_sign = partial.zodiacSign;
  if ("birthDate" in partial) payload.birth_date = partial.birthDate;
  if ("birthTime" in partial) payload.birth_time = partial.birthTime;
  if ("birthPlace" in partial) payload.birth_place = partial.birthPlace;
  // --- FIX: ADDED MISSING FIELDS ---
  if ("skinType" in partial) payload.skin_type = partial.skinType;
  if ("gender" in partial) payload.gender = partial.gender;
  if ("age" in partial) payload.age = partial.age;
  // --- END FIX ---
  return payload;
};

/**
 * Creates the profile for the current authenticated user only.
 */
// export const registerUser = async (profileData) => {
//   try {
//     const {
//       data: { user },
//       error: authError,
//     } = await supabase.auth.getUser();

//     if (authError || !user) {
//       return { success: false, error: "Not authenticated." };
//     }

//     // Use the mapper to convert ALL fields from camelCase to snake_case
//     const payload = mapToProfileColumns(profileData);

//     // --- FIX: Simplified and corrected the row object ---
//     const row = {
//       id: user.id,
//       email: profileData.email,
//       ...payload,
//       friends: [],
//       points: 100,
//       total_advice_upvotes: 0,
//       joined_date: new Date().toISOString().slice(0, 10),
//     };

//     const { error: insertError } = await supabase
//       .from("profiles")
//       .insert([row], { bypassRLS: true }); // Temporarily bypass RLS

//     if (insertError) {
//       console.error("Supabase insert error:", insertError);
//       return { success: false, error: insertError.message };
//     }

//     return { success: true };
//   } catch (err) {
//     console.error("Catch block error in registerUser:", err);
//     return { success: false, error: err.message };
//   }
// };

/**
 * Logs in a user.
 */
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) return { success: false, error: error.message };
    return { success: true, user: data.user };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Handles daily login rewards.
 */
export const handleDailyLogin = async (userId) => {
  try {
    const today = new Date().toDateString();
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("last_login, points")
      .eq("id", userId)
      .maybeSingle();
    if (fetchError) throw fetchError;

    if (profile?.last_login !== today) {
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ last_login: today })
        .eq("id", userId);
      if (updateError) throw updateError;

      const newPoints = await updateUserPoints(userId, 10);
      return { status: "success", newPoints };
    }
    return { status: "success", newPoints: profile?.points };
  } catch (err) {
    return { status: "error", error: err.message };
  }
};

/**
 * Gets all posts.
 */
export const getPosts = async () => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return Array.isArray(data) ? data : [];
  } catch (err) {
    return [];
  }
};

/**
 * Gets comments for a post.
 */
export const getComments = async (postId) => {
  try {
    const { data, error } = await supabase
      .from("post_comments")
      .select("*, profiles(username, avatar_url)")
      .eq("post_id", postId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return data;
  } catch (err) {
    return [];
  }
};

/**
 * Toggles a like on a post using a Supabase RPC function.
 * This is efficient as it performs the like/unlike and counter update in one transaction.
 */
export const togglePostLike = async (postId, userId) => {
  try {
    const { data, error } = await supabase.rpc("toggle_post_like", {
      post_id_input: postId,
      user_id_input: userId,
    });

    if (error) {
      console.error("Error toggling post like:", error);
      throw new Error(error.message);
    }

    return { success: true, liked: data, error: null };
  } catch (err) {
    return { success: false, liked: null, error: err.message };
  }
};

/**
 * Toggles a like on a comment using a Supabase RPC function.
 */
export const toggleCommentLike = async (commentId, userId) => {
  try {
    const { data, error } = await supabase.rpc("toggle_comment_like", {
      comment_id_input: commentId,
      user_id_input: userId,
    });

    if (error) {
      console.error("Error toggling comment like:", error);
      throw new Error(error.message);
    }

    return { success: true, liked: data, error: null };
  } catch (err) {
    return { success: false, liked: null, error: err.message };
  }
};

/**
 * Adds a comment to a post and updates the post's comment count in one transaction.
 */
export const addComment = async (postId, userId, text) => {
  try {
    const { data, error } = await supabase.rpc("add_new_comment", {
      post_id_input: postId,
      user_id_input: userId,
      comment_text_input: text,
    });

    if (error) {
      console.error("Error adding comment:", error);
      throw new Error(error.message);
    }
    return { success: true, data, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message };
  }
};

/**
 * Creates a new post and automatically generates tags from its content.
 */
export const createNewPost = async (content, imageUrl, user, privacy) => {
  try {
    const { data, error } = await supabase.rpc("create_new_post", {
      content_input: content,
      image_url_input: imageUrl,
      user_id_input: user.id,
      privacy_input: privacy,
      user_name_input: user.fullName, // Pass the user's name
      user_email_input: user.email, // Pass the user's email
      avatar_url_input: user.avatarUrl, // Pass the user's avatar
    });

    if (error) {
      console.error("Error creating new post:", error);
      throw new Error(error.message);
    }
    return { success: true, data, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message };
  }
};

/**
 * Gets all posts with user like status and author's profile info.
 */
export const getPersonalizedPosts = async (currentUserId) => {
  try {
    let query = supabase
      .from("posts")
      .select(
        `
        *,
        profile:profiles(full_name, avatar_url)
      `
      )
      .order("created_at", { ascending: false });

    const { data, error } = await query;

    if (error) {
      console.error("Error fetching personalized posts:", error);
      throw error;
    }

    // Now, we determine if the current user has liked each post
    if (currentUserId) {
      const postIds = data.map((post) => post.id);
      const { data: likes, error: likesError } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", currentUserId)
        .in("post_id", postIds);

      if (likesError) throw likesError;

      const likedPostIds = new Set(likes.map((like) => like.post_id));

      return data.map((post) => ({
        ...post,
        user: post.profile?.full_name || "Anonymous", // Use profile data
        avatar_url: post.profile?.avatar_url, // Use profile data
        user_has_liked: likedPostIds.has(post.id),
      }));
    }

    // For logged-out users
    return data.map((post) => ({
      ...post,
      user: post.profile?.full_name || "Anonymous",
      avatar_url: post.profile?.avatar_url,
      user_has_liked: false,
    }));
  } catch (err) {
    console.error("Failed to get posts:", err);
    return [];
  }
};

/**
 * Gets comments for a post, including user profile info and like status.
 */
export const getCommentsForPost = async (postId, currentUserId) => {
  try {
    const { data, error } = await supabase
      .from("post_comments")
      .select(
        `*, profile:profiles(full_name, avatar_url), user_has_liked:comment_likes!left(user_id)`
      )
      .eq("post_id", postId)
      .eq("comment_likes.user_id", currentUserId)
      .order("created_at", { ascending: true });
    if (error) throw error;
    return (
      data.map(({ user_has_liked, ...rest }) => ({
        ...rest,
        user_has_liked: user_has_liked.length > 0,
      })) || []
    );
  } catch (err) {
    console.error("Failed to get comments:", err);
    return [];
  }
};

/**
 * Toggles like for a post.
 */
export const toggleLike = async (postId, userId) => {
  try {
    const { data: existing, error: fetchError } = await supabase
      .from("post_likes")
      .select("*")
      .eq("post_id", postId)
      .eq("user_id", userId)
      .single();
    if (fetchError && fetchError.code !== "PGRST116") throw fetchError;

    if (existing) {
      const { error: deleteError } = await supabase
        .from("post_likes")
        .delete()
        .eq("id", existing.id);
      if (deleteError) throw deleteError;
      return { liked: false };
    } else {
      const { error: insertError } = await supabase
        .from("post_likes")
        .insert([{ post_id: postId, user_id: userId }]);
      if (insertError) throw insertError;
      return { liked: true };
    }
  } catch (err) {
    return { liked: null, error: err.message };
  }
};

/**
 * Sends a message between users.
 */
export const sendMessage = async (senderId, receiverId, content) => {
  try {
    const { data, error } = await supabase
      .from("user_connections")
      .insert([{ sender_id: senderId, receiver_id: receiverId, content }]);
    if (error) throw error;
    return data;
  } catch (err) {
    return null;
  }
};

/**
 * Gets the current authenticated user's profile.
 */
export const getUser = async () => {
  try {
    const {
      data: { user: authUser },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !authUser) return null;

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", authUser.id)
      .maybeSingle();

    return {
      id: authUser.id,
      email: authUser.email,
      fullName: profile?.full_name ?? authUser.user_metadata?.fullName ?? null,
      avatarUrl: profile?.avatar_url ?? null,
      points: typeof profile?.points === "number" ? profile.points : 0,
      friends: Array.isArray(profile?.friends) ? profile.friends : [],
      totalAdviceUpvotes:
        typeof profile?.total_advice_upvotes === "number"
          ? profile.total_advice_upvotes
          : 0,
      lastLogin: profile?.last_login ?? null,
      profile,
    };
  } catch {
    return null;
  }
};

/**
 * Updates user points.
 */
export const updateUserPoints = async (userId, pointsDelta) => {
  try {
    const { data: profile, error: fetchError } = await supabase
      .from("profiles")
      .select("points")
      .eq("id", userId)
      .single();
    if (fetchError) throw fetchError;

    const newPoints = (profile?.points || 0) + pointsDelta;
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", userId);
    if (updateError) throw updateError;
    return newPoints;
  } catch {
    return null;
  }
};

/**
 * Redeems a reward for a user.
 */
export const redeemReward = async (userId, rewardId) => {
  try {
    const { data, error } = await supabase
      .from("user_rewards")
      .insert([{ user_id: userId, reward_id: rewardId }]);
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

/**
 * Adds a friend connection.
 */
export const addFriend = async (userId, friendId) => {
  try {
    const { data, error } = await supabase
      .from("user_connections")
      .insert([{ sender_id: userId, receiver_id: friendId, type: "friend" }]);
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

/**
 * Refers a friend.
 */
export const referFriend = async (referrerId, referredEmail) => {
  try {
    const { data, error } = await supabase
      .from("referrals")
      .insert([{ referrer_id: referrerId, referred_email: referredEmail }]);
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

/**
 * Reports a post.
 */
export const reportPost = async (postId, userId, reason) => {
  try {
    const { data, error } = await supabase
      .from("post_reports")
      .insert([{ post_id: postId, user_id: userId, reason }]);
    if (error) throw error;
    return data;
  } catch {
    return null;
  }
};

/**
 * Increments the share count for a post using an RPC function.
 */
export const sharePost = async (postId) => {
  try {
    const { error } = await supabase.rpc("increment_share_count", {
      post_id_input: postId,
    });
    if (error) throw error;
    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

/**
 * Updates the current authenticated user's profile.
 * It now uses the mapper function to handle naming differences.
 */
export const updateUser = async (profileData) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated.");

    const payload = mapToProfileColumns(profileData);

    if (Object.keys(payload).length === 0) {
      return { success: true, data: user, error: null }; // Nothing to update
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", user.id)
      .select()
      .single();

    if (error) throw error;

    // Fetch the latest full user profile to return to the UI
    const updatedUser = await getUser();
    return { success: true, data: updatedUser, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message };
  }
};

/**
 * Updates any user's profile by id (admin/server-side).
 */
export const updateUserById = async (userId, partial) => {
  try {
    const payload = mapToProfileColumns(partial);
    if (Object.keys(payload).length === 0) {
      return { data: null, error: new Error("No valid fields to update") };
    }

    const { data: rows, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", userId)
      .select("*");

    return { data: Array.isArray(rows) ? rows[0] : null, error };
  } catch (err) {
    return { data: null, error: err };
  }
};

/**
 * Normalizes the merged shape you want to use in the app.
 */
const mergeAuthAndProfile = (authUser, profile) => ({
  id: authUser.id,
  email: authUser.email,
  fullName: profile?.full_name ?? authUser.user_metadata?.fullName ?? null,
  avatarUrl: profile?.avatar_url ?? null,
  points: typeof profile?.points === "number" ? profile.points : 0,
  friends: Array.isArray(profile?.friends) ? profile.friends : [],
  totalAdviceUpVotes:
    typeof profile?.total_advice_up_votes === "number"
      ? profile.total_advice_up_votes
      : 0,
  zodiacSign: profile?.zodiac_sign ?? null,
  skinType: profile?.skin_type ?? null,
  gender: profile?.gender ?? null,
  lastLogin: profile?.last_login ?? null,
  birthDate: profile?.birth_date ?? null,
  birthTime: profile?.birth_time ?? null,
  birthPlace: profile?.birth_place ?? null,
  profile,
});

/**
 * Fetches all astrology-related content from the database.
 * This is efficient as it gets all data in a single call.
 */
export const getAstrologyContent = async () => {
  try {
    const { data, error } = await supabase
      .from("astrology_content")
      .select("*");
    if (error) throw error;
    return { success: true, data, error: null };
  } catch (err) {
    return { success: false, data: null, error: err.message };
  }
};

/**
 * Handles the purchase of a premium report by deducting points from a user.
 * This is now a proper async function that interacts with the database.
 */
export const purchasePremiumReport = async (userId, currentPoints, cost) => {
  if (currentPoints < cost) {
    return { success: false, error: "Not enough points." };
  }

  const newPoints = currentPoints - cost;

  try {
    const { error } = await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", userId);

    if (error) throw error;

    // Here you would typically trigger the logic to grant access to the report
    // For now, we'll just confirm the point deduction was successful.

    return { success: true, error: null };
  } catch (err) {
    return { success: false, error: err.message };
  }
};
