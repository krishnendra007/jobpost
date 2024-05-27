document.addEventListener('DOMContentLoaded', async function() {
    const searchForm = document.getElementById('searchForm');
    const searchText = document.getElementById('searchText');
    const addPostForm = document.getElementById('addPostForm');
    const postTitle = document.getElementById('postTitle');
    const postContent = document.getElementById('postContent');
    const postExp = document.getElementById('postExp');
    const postTechs = document.getElementById('postTechs');
    const postsContainer = document.getElementById('postsContainer');

    searchForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const searchTerm = searchText.value.trim();
        if (searchTerm !== '') {
            try {
                const posts = await searchPosts(searchTerm);
                displayPosts(posts);
            } catch (error) {
                console.error('Error fetching posts:', error);
            }
        }
    });

    addPostForm.addEventListener('submit', async function(event) {
        event.preventDefault();
        const title = postTitle.value.trim();
        const content = postContent.value.trim();
        const exp = parseInt(postExp.value);
        const techs = postTechs.value.split(',').map(tech => tech.trim());
        if (title !== '' && content !== '' && !isNaN(exp) && techs.length > 0) {
            try {
                const newPost = {
                    profile: title,
                    desc: content,
                    exp: exp,
                    techs: techs
                };
                const addedPost = await addPost(newPost);
                displayPost(addedPost);
                // Clear form fields
                postTitle.value = '';
                postContent.value = '';
                postExp.value = '';
                postTechs.value = '';
            } catch (error) {
                console.error('Error adding post:', error);
            }
        } else {
            alert('Please fill out all fields correctly.');
        }
    });

    async function searchPosts(text) {
        const response = await fetch(`/posts/${text}`);
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        return await response.json();
    }

    async function getAllPosts() {
        const response = await fetch('/posts');
        if (!response.ok) {
            throw new Error('Failed to fetch posts');
        }
        return await response.json();
    }

    async function addPost(post) {
        const response = await fetch('/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        });
        if (!response.ok) {
            throw new Error('Failed to add post');
        }
        return await response.json();
    }

    function displayPosts(posts) {
        postsContainer.innerHTML = '';
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts found.</p>';
        } else {
            for (let i = 0; i < posts.length; i++) {
                displayPost(posts[i]);
            }
        }
    }

    function displayPost(post) {
        const postElement = document.createElement('div');
        postElement.classList.add('post');
        postElement.innerHTML = `
            <h3>${post.profile}</h3>
            <p>${post.desc}</p>
            <p>Experience: ${post.exp} years</p>
            <p>Technologies: ${post.techs.join(', ')}</p>
        `;
        postsContainer.appendChild(postElement);
    }

    // Display all posts when the page loads
    try {
        const allPosts = await getAllPosts();
        displayPosts(allPosts);
    } catch (error) {
        console.error('Error fetching posts:', error);
    }
});
