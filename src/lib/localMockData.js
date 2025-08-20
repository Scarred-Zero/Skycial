import { allTips } from '@/lib/cultural-tips-db';

const initialPosts = [
    { id: 1, user: 'Stella Moon', userEmail: 'stella@example.com', avatarUrl: 'https://i.ibb.co/yWdK8P4/astro-girl-1.jpg', time: '1 hour ago', content: 'Has anyone tried retinol for fine lines? I\'m 25 and starting to see some around my eyes. Looking for gentle product recommendations! 🌟', likes: [], comments: [{id: 1, user: 'Cosmic Glow', text: 'I love The Ordinary\'s Granactive Retinoid! Super gentle.', likes: []}], shares: 5, tags: ['skincare', 'anti-aging', 'retinol', 'female'], image: 'https://images.unsplash.com/photo-1596548438234-9143d8f8a253', category: 'advice', privacy: 'global' },
    { id: 2, user: 'Aurora Beauty', userEmail: 'aurora@example.com', avatarUrl: 'https://i.ibb.co/7bJb4tW/astro-girl-2.jpg', time: '3 hours ago', content: 'Before and after using vitamin C serum for 3 months! The glow is real ✨ My Virgo perfectionist side is so happy with these results!', likes: [], comments: [], shares: 12, tags: ['vitamin-c', 'glow', 'before-after', 'female'], image: 'https://images.unsplash.com/photo-1600959991533-4962f6aa363c', category: 'results', privacy: 'global' },
    { id: 3, user: 'Cosmic Glow', userEmail: 'glow@example.com', avatarUrl: 'https://i.ibb.co/dKqV0zM/astro-girl-3.jpg', time: '5 hours ago', content: 'DIY face mask recipe that changed my life! Honey + oatmeal + a touch of turmeric. Perfect for my sensitive skin 🐠', likes: [], comments: [], shares: 8, tags: ['diy', 'natural', 'sensitive-skin', 'unisex'], image: null, category: 'tips', privacy: 'global' },
    { id: 4, user: 'Leo Power', userEmail: 'leo@example.com', avatarUrl: 'https://i.ibb.co/yWdK8P4/astro-girl-1.jpg', time: '8 hours ago', content: 'Looking for a solid, non-greasy sunscreen for daily use. Any recommendations for men\'s skincare?', likes: [], comments: [], shares: 3, tags: ['sunscreen', 'mens-grooming', 'skincare', 'male'], image: null, category: 'advice', privacy: 'global' },
    { id: 5, user: 'Jordan River', userEmail: 'jordan@example.com', avatarUrl: 'https://i.ibb.co/7bJb4tW/astro-girl-2.jpg', time: '1 day ago', content: 'This beard oil has been a game changer for softness and growth. Highly recommend it!', likes: [], comments: [], shares: 7, tags: ['beard-care', 'mens-grooming', 'male'], image: 'https://images.unsplash.com/photo-1621607512214-6a1a18c43519', category: 'tips', privacy: 'global' },
];

const initializeData = () => {
    if (!localStorage.getItem('skycial_posts')) {
        localStorage.setItem('skycial_posts', JSON.stringify(initialPosts));
    }
};

getPersonalizedPosts, toggleLike, addComment, getUser, reportPost, sharePost, toggleCommentLike

initializeData();

export const registerUser = (userData) => {
  const existingUsers = JSON.parse(localStorage.getItem('skycialUsers')) || [];
  if (!existingUsers.find(user => user.email === userData.email)) {
    existingUsers.push({ ...userData, friends: [], points: 100, totalAdviceUpvotes: 0 });
    localStorage.setItem('skycialUsers', JSON.stringify(existingUsers));
    return true;
  }
  return false;
};

export const loginUser = (email, password) => {
    const users = JSON.parse(localStorage.getItem('skycialUsers') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    return user || null;
};

export const getPosts = () => {
    const posts = localStorage.getItem('skycial_posts');
    return posts ? JSON.parse(posts) : [];
};

export const getPersonalizedPosts = (currentUser) => {
    let allPosts = getPosts();
    if (!currentUser) return allPosts.filter(p => p.privacy === 'global');

    const gender = currentUser.gender || 'unisex';

    allPosts = allPosts.filter(post => {
        if (post.privacy === 'private' && post.userEmail !== currentUser.email) return false;
        if (post.privacy === 'friends' && !currentUser.friends.includes(post.userEmail) && post.userEmail !== currentUser.email) return false;
        return true;
    });

    return allPosts.sort((a, b) => {
        const aRelevance = (a.tags.includes(gender) || a.tags.includes('unisex')) ? 1 : 0;
        const bRelevance = (b.tags.includes(gender) || b.tags.includes('unisex')) ? 1 : 0;
        return bRelevance - aRelevance;
    });
}

export const addPost = (post) => {
    const posts = getPosts();
    const newPost = {
        id: Date.now(),
        ...post,
        likes: [],
        comments: [],
        shares: 0,
        time: 'Just now'
    };
    const updatedPosts = [newPost, ...posts];
    localStorage.setItem('skycial_posts', JSON.stringify(updatedPosts));
    updateUserPoints(post.userEmail, 25);
    return newPost;
};

export const toggleLike = (postId, userEmail) => {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const likedIndex = post.likes.indexOf(userEmail);

    if (likedIndex === -1) {
        post.likes.push(userEmail);
    } else {
        post.likes.splice(likedIndex, 1);
    }

    posts[postIndex] = post;
    localStorage.setItem('skycial_posts', JSON.stringify(posts));
    return post;
};

export const addComment = (postId, userEmail, userName, userAvatar, commentText) => {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const newComment = { 
        id: Date.now(),
        user: userName,
        userEmail: userEmail,
        avatarUrl: userAvatar,
        text: commentText,
        likes: [] 
    };
    post.comments.push(newComment);

    posts[postIndex] = post;
    localStorage.setItem('skycial_posts', JSON.stringify(posts));
    return post;
};

export const toggleCommentLike = (postId, commentId, likingUserEmail) => {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    const post = posts[postIndex];
    const commentIndex = post.comments.findIndex(c => c.id === commentId);
    if (commentIndex === -1) return;

    const comment = post.comments[commentIndex];
    const likedIndex = comment.likes.indexOf(likingUserEmail);

    let wasLiked = false;
    if (likedIndex === -1) {
        comment.likes.push(likingUserEmail);
        wasLiked = true;
    } else {
        comment.likes.splice(likedIndex, 1);
    }

    posts[postIndex].comments[commentIndex] = comment;
    localStorage.setItem('skycial_posts', JSON.stringify(posts));

    // Update the original commenter's upvote count
    const allUsers = JSON.parse(localStorage.getItem('skycialUsers')) || [];
    const commenterIndex = allUsers.findIndex(u => u.email === comment.userEmail);
    if (commenterIndex !== -1) {
        if (!allUsers[commenterIndex].totalAdviceUpvotes) {
            allUsers[commenterIndex].totalAdviceUpvotes = 0;
        }
        allUsers[commenterIndex].totalAdviceUpvotes += wasLiked ? 1 : -1;
        localStorage.setItem('skycialUsers', JSON.stringify(allUsers));
    }

    return post;
};

export const reportPost = (postId) => {
    console.log(`Post ${postId} has been reported.`);
};

export const sharePost = (postId) => {
    const posts = getPosts();
    const postIndex = posts.findIndex(p => p.id === postId);
    if (postIndex === -1) return;

    posts[postIndex].shares += 1;
    localStorage.setItem('skycial_posts', JSON.stringify(posts));
    return posts[postIndex];
};

export const getUser = () => {
    const userStr = sessionStorage.getItem('skycial_user') || localStorage.getItem('skycial_user');
    if (!userStr) return null;

    const user = JSON.parse(userStr);
    if (user.expiry && Date.now() > user.expiry) {
        localStorage.removeItem('skycial_user');
        return null;
    }
    // Sync user data with the main users list to get latest info like points/friends
    const allUsers = JSON.parse(localStorage.getItem('skycialUsers')) || [];
    const freshUser = allUsers.find(u => u.email === user.email);
    return freshUser ? { ...user, ...freshUser } : user;
};

export const updateUser = (updatedUserData) => {
    const currentUser = getUser();
    if (!currentUser) return;
    
    const allUsers = JSON.parse(localStorage.getItem('skycialUsers')) || [];
    let updatedUserInList;
    const updatedAllUsers = allUsers.map(u => {
        if (u.email === currentUser.email) {
            updatedUserInList = { ...u, ...updatedUserData };
            return updatedUserInList;
        }
        return u;
    });
    localStorage.setItem('skycialUsers', JSON.stringify(updatedAllUsers));

    const newUserSessionData = { ...currentUser, ...updatedUserData };
    if (sessionStorage.getItem('skycial_user')) {
        sessionStorage.setItem('skycial_user', JSON.stringify(newUserSessionData));
    } else if (localStorage.getItem('skycial_user')) {
        localStorage.setItem('skycial_user', JSON.stringify(newUserSessionData));
    }

    return newUserSessionData;
};

export const updateUserPoints = (userEmail, pointsToAdd) => {
    const users = JSON.parse(localStorage.getItem('skycialUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === userEmail);

    if (userIndex !== -1) {
        users[userIndex].points = (users[userIndex].points || 0) + pointsToAdd;
        localStorage.setItem('skycialUsers', JSON.stringify(users));

        const currentUser = getUser();
        if (currentUser && currentUser.email === userEmail) {
            const updatedUser = { ...currentUser, points: users[userIndex].points };
            if (sessionStorage.getItem('skycial_user')) {
                sessionStorage.setItem('skycial_user', JSON.stringify(updatedUser));
            } else if (localStorage.getItem('skycial_user')) {
                localStorage.setItem('skycial_user', JSON.stringify(updatedUser));
            }
            return updatedUser;
        }
    }
    return null;
};

export const redeemReward = (userEmail, cost) => {
    const users = JSON.parse(localStorage.getItem('skycialUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === userEmail);

    if (userIndex !== -1 && users[userIndex].points >= cost) {
        users[userIndex].points -= cost;
        localStorage.setItem('skycialUsers', JSON.stringify(users));

        const currentUser = getUser();
        if (currentUser && currentUser.email === userEmail) {
            const updatedUser = { ...currentUser, points: users[userIndex].points };
            if (sessionStorage.getItem('skycial_user')) {
                sessionStorage.setItem('skycial_user', JSON.stringify(updatedUser));
            } else if (localStorage.getItem('skycial_user')) {
                localStorage.setItem('skycial_user', JSON.stringify(updatedUser));
            }
            return updatedUser;
        }
    }
    return null;
};

export const purchasePremiumReport = (userEmail, cost) => {
    const users = JSON.parse(localStorage.getItem('skycialUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === userEmail);

    if (userIndex !== -1 && users[userIndex].points >= cost) {
        users[userIndex].points -= cost;
        localStorage.setItem('skycialUsers', JSON.stringify(users));

        const currentUser = getUser();
        if (currentUser && currentUser.email === userEmail) {
            const updatedUser = { ...currentUser, points: users[userIndex].points };
            if (sessionStorage.getItem('skycial_user')) {
                sessionStorage.setItem('skycial_user', JSON.stringify(updatedUser));
            } else if (localStorage.getItem('skycial_user')) {
                localStorage.setItem('skycial_user', JSON.stringify(updatedUser));
            }
            return updatedUser;
        }
    }
    return null;
};

export const handleDailyLogin = (userEmail) => {
    const today = new Date().toDateString();
    const users = JSON.parse(localStorage.getItem('skycialUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === userEmail);

    if (userIndex !== -1) {
        if (users[userIndex].lastLogin !== today) {
            users[userIndex].lastLogin = today;
            localStorage.setItem('skycialUsers', JSON.stringify(users));
            return updateUserPoints(userEmail, 10);
        }
    }
    return null;
};

export const addFriend = (userEmail, friendEmail) => {
    const users = JSON.parse(localStorage.getItem('skycialUsers') || '[]');
    const userIndex = users.findIndex(u => u.email === userEmail);
    const friendIndex = users.findIndex(u => u.email === friendEmail);

    if (userIndex !== -1 && friendIndex !== -1) {
        if (!users[userIndex].friends) {
            users[userIndex].friends = [];
        }
        if (!users[userIndex].friends.includes(friendEmail)) {
            users[userIndex].friends.push(friendEmail);
            localStorage.setItem('skycialUsers', JSON.stringify(users));
            const updatedUser = updateUser({ friends: users[userIndex].friends });
            return updatedUser;
        }
    }
    return null;
};

export const referFriend = (userEmail, referralCode) => {
    console.log(`User ${userEmail} referred a friend with code: ${referralCode}`);
    return true;
};