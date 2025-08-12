// Firebase ডাটাবেস রেফারেন্স তৈরি
const db = firebase.database();

// নতুন পোস্ট যোগ করার ফাংশন
function addPost(userName, message) {
  const postsRef = db.ref('posts');  // 'posts' নামে ডাটাবেসের রেফারেন্স
  const newPostRef = postsRef.push(); // নতুন আইডি তৈরি করে ডাটাবেসে ঢোকানোর জন্য
  newPostRef.set({
    user: userName,
    text: message,
    timestamp: Date.now()
  });
}

// রিয়েল-টাইম ডাটাবেস থেকে পোস্টগুলো লোড করা এবং দেখানো
const feedSection = document.querySelector('.feed');

db.ref('posts').on('value', snapshot => {
  feedSection.innerHTML = ''; // পুরনো পোস্ট ক্লিয়ার করে দিবে
  const posts = snapshot.val();
  if(posts) {
    // পোস্টগুলো টাইমস্ট্যাম্প অনুসারে নামিয়ে দেখানো (নতুন থেকে পুরানো)
    const sortedPosts = Object.entries(posts).sort((a,b) => b[1].timestamp - a[1].timestamp);
    for (const [key, post] of sortedPosts) {
      const postEl = document.createElement('div');
      postEl.className = 'post-box';
      postEl.innerHTML = `
        <div class="post-header">
          <img src="https://i.pravatar.cc/50?u=${post.user}" alt="User" class="post-user-pic" />
          <div>
            <h4>${post.user}</h4>
            <small>${new Date(post.timestamp).toLocaleString()}</small>
          </div>
        </div>
        <p>${post.text}</p>
        <div class="post-actions">
          <button class="like-btn">Like</button>
          <button class="comment-btn">Comment</button>
          <button class="share-btn">Share</button>
        </div>
      `;
      feedSection.appendChild(postEl);
    }
  } else {
    feedSection.innerHTML = '<p>No posts yet.</p>';
  }
});
const postBtn = document.getElementById('postBtn');
const userNameInput = document.getElementById('userNameInput');
const postInput = document.getElementById('postInput');

postBtn.addEventListener('click', () => {
  const user = userNameInput.value.trim();
  const message = postInput.value.trim();
  if (!user || !message) {
    alert('Please enter your name and a message');
    return;
  }
  addPost(user, message);
  userNameInput.value = '';
  postInput.value = '';
});
const emojiBtn = document.querySelector('#emojiBtn');
const postInput = document.querySelector('#postInput');

const picker = new EmojiButton({
  position: 'bottom-start',
  theme: 'light',
});

emojiBtn.addEventListener('click', () => {
  picker.togglePicker(emojiBtn);
});

picker.on('emoji', emoji => {
  // কার্সার পজিশনে ইমোজি ইনসার্ট করার সহজ উপায়
  const start = postInput.selectionStart;
  const end = postInput.selectionEnd;
  const text = postInput.value;
  postInput.value = text.slice(0, start) + emoji + text.slice(end);
  postInput.selectionStart = postInput.selectionEnd = start + emoji.length;
  postInput.focus();
});
