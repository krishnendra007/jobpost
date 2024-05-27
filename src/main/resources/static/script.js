document.addEventListener('DOMContentLoaded', function() {
    const searchForm = document.getElementById('searchForm');
    const searchText = document.getElementById('searchText');
    const addPostForm = document.getElementById('addPostForm');
    const postTitle = document.getElementById('postTitle');
    const postContent = document.getElementById('postContent');
    const postExp = document.getElementById('postExp');
    const postTechs = document.getElementById('postTechs');
    const postsContainer = document.getElementById('postsContainer');

    searchForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const searchTerm = searchText.value.trim();
        if (searchTerm !== '') {
            searchPosts(searchTerm);
        }
    });

    addPostForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const title = postTitle.value.trim();
        const content = postContent.value.trim();
        const exp = parseInt(postExp.value);
        const techs = postTechs.value.split(',').map(tech => tech.trim());
        if (title !== '' && content !== '' && !isNaN(exp) && techs.length > 0) {
            const newPost = {
                profile: title,
                desc: content,
                exp: exp,
                techs: techs
            };
            addPost(newPost);
            postTitle.value = '';
            postContent.value = '';
            postExp.value = '';
            postTechs.value = '';
        } else {
            alert('Please fill out all fields correctly.');
        }
    });

    function searchPosts(text) {
        fetch(`/posts/${text}`)
            .then(response => response.json())
            .then(posts => {
                displayPosts(posts);
            })
            .catch(error => console.error('Error fetching posts:', error));
    }

    function getAllPosts() {
        fetch('/posts')
            .then(response => response.json())
            .then(posts => {
                displayPosts(posts);
            })
            .catch(error => console.error('Error fetching posts:', error));
    }

    function addPost(post) {
        fetch('/post', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(post)
        })
        .then(response => response.json())
        .then(addedPost => {
            displayPost(addedPost);
        })
        .catch(error => console.error('Error adding post:', error));
    }

    function displayPosts(posts) {
        postsContainer.innerHTML = '';
        if (posts.length === 0) {
            postsContainer.innerHTML = '<p>No posts found.</p>';
        } else {
            posts.forEach(post => {
                displayPost(post);
            });
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

    // Initial load
    getAllPosts();
});
