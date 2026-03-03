import { useState, useCallback } from 'react';



const BlogList = () => {

  const [blogs] = useState([
    {
      id: 1,
      title: 'Getting Started with React Hooks',
      excerpt: 'Learn how to use React Hooks to manage state and side effects.',
      author: { name: 'Sarah Chen', avatar: 'https://i.pravatar.cc/150?img=1' },
      category: 'React',
      tags: ['React', 'JavaScript', 'Hooks'],
      date: '2024-03-01',
      views: 1234,
      comments: 45,
      helpful: 89,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop'
    },
    {
      id: 2,
      title: 'TypeScript Best Practices',
      excerpt: 'Explore essential TypeScript patterns and best practices.',
      author: { name: 'Alex Kumar', avatar: 'https://i.pravatar.cc/150?img=2' },
      category: 'TypeScript',
      tags: ['TypeScript', 'Best Practices'],
      date: '2024-02-28',
      views: 856,
      comments: 32,
      helpful: 67,
      image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500&h=500&fit=crop'
    },
    {
      id: 3,
      title: 'Tailwind CSS Tips and Tricks',
      excerpt: 'Master utility-first CSS with Tailwind and build faster.',
      author: { name: 'Jordan Smith', avatar: 'https://i.pravatar.cc/150?img=3' },
      category: 'CSS',
      tags: ['Tailwind', 'CSS', 'Design'],
      date: '2024-03-02',
      views: 2145,
      comments: 78,
      helpful: 156,
      image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=500&h=500&fit=crop'
    },
    {
      id: 4,
      title: 'Web Performance Optimization',
      excerpt: 'Improve your website loading speed and user experience.',
      author: { name: 'Emma Davis', avatar: 'https://i.pravatar.cc/150?img=4' },
      category: 'Performance',
      tags: ['Performance', 'Web', 'Optimization'],
      date: '2024-03-01',
      views: 1876,
      comments: 54,
      helpful: 134,
      image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=500&fit=crop'
    }
    
  ]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('latest');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const categories = ['All', ...new Set(blogs.map(blog => blog.category))];

  const filteredAndSortedBlogs = useCallback(() => {
    let filtered = blogs.filter(blog => {
      const matchesSearch = blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === 'All' || blog.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });

filtered.sort((a, b) => {
  switch(sortBy) {
    case 'latest': 
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    case 'popular': 
      return b.views - a.views;
    case 'toprated': 
      return b.helpful - a.helpful;
    default: 
      return 0;
  }
});

    return filtered;
  }, [blogs, searchQuery, selectedCategory, sortBy]);

  const sorted = filteredAndSortedBlogs();
  const totalPages = Math.ceil(sorted.length / itemsPerPage);
  const paginatedBlogs = sorted.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // SVG Icons
  const SearchIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  );

  const EyeIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
    </svg>
  );

  const ChatIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 8h10M7 12h4m1 8l-4-2H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 2z" />
    </svg>
  );

  const ThumbsUpIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M14 9V5a3 3 0 00-6 0v4H5a2 2 0 00-2 2v6a2 2 0 002 2h9.28a2 2 0 001.95-1.57l1.38-6A2 2 0 0015.67 9H14z"/>
  </svg>
);

  const ArrowRightIcon = () => (
    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
    </svg>
  );

  const FilterIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
    </svg>
  );

  const SortIcon = () => (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
    </svg>
  );

  return (
    <div className="bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 z-40">
        
        <div className="max-w-6xl mx-auto px-6 pt-1 pb-4">
          
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Blogs</h1>
          <div className="flex items-start justify-between mb-6">
          <p className="text-slate-600 mb-6">Discover insights from tutors and students</p>
        </div>

          {/* Search Bar */}
          <div className="flex gap-3 mb-6">
            <div className="flex-1 relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search blogs..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 items-center">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-slate-600">
                <FilterIcon />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => { setSelectedCategory(e.target.value); setCurrentPage(1); }}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white cursor-pointer font-medium"
              >
                {categories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <div className="w-5 h-5 text-slate-600">
                <SortIcon />
              </div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border border-slate-300 rounded-lg bg-white cursor-pointer font-medium"
              >
                <option value="latest">Latest</option>
                <option value="popular">Most Viewed</option>
                <option value="toprated">Top Rated</option>
              </select>
            </div>

            <div className="ml-auto text-sm text-slate-600 font-medium">{sorted.length} results</div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-6 pt-6 py-12">
        {paginatedBlogs.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-slate-600 text-lg">No blogs found</p>
          </div>
        ) : (
          <>
            {/* 2x2 Grid - 4 Square Blogs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {paginatedBlogs.map(blog => (
                <article key={blog.id} className="bg-white rounded-lg border border-slate-200 overflow-hidden hover:shadow-lg transition-all flex flex-col group cursor-pointer h-full">
                  {/* Square Image */}
                  <div className="relative overflow-hidden h-32 bg-slate-200">
                    <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                        {blog.category}
                    </span>
                </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-2 group-hover:text-orange-600">{blog.title}</h3>
                    <p className="text-slate-600 text-sm mb-4 line-clamp-2 flex-grow">{blog.excerpt}</p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {blog.tags.slice(0, 2).map(tag => (
                        <span key={tag} className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded">#{tag}</span>
                      ))}
                    </div>

                    {/* Author */}
                    <div className="flex items-center gap-3 mb-4 pb-4 border-t border-slate-100">
                      <img src={blog.author.avatar} alt={blog.author.name} className="w-8 h-8 rounded-full" />
                      <div className="text-xs">
                        <p className="font-semibold">{blog.author.name}</p>
                        <p className="text-slate-500">{blog.date}</p>
                      </div>
                    </div>

                    {/* Engagement Metrics */}
                    <div className="flex justify-between text-xs text-slate-600 mb-4">
                      <div className="flex gap-3">
                        <span className="flex items-center gap-1">
                          <EyeIcon /> {blog.views}
                        </span>
                        <span className="flex items-center gap-1">
                          <ChatIcon /> {blog.comments}
                        </span>
                      </div>
                      <span className="flex items-center gap-1 text-blue-600 font-semibold">
                        <ThumbsUpIcon /> {blog.helpful}
                      </span>
                    </div>

                    {/* CTA Button */}
                    <button className="w-full py-2 bg-orange-50 text-rose-600 font-semibold rounded-lg hover:bg-blue-100 flex items-center justify-center gap-2">
                      Read Article <ArrowRightIcon />
                    </button>
                  </div>
                </article>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-3 mb-8">
                <button onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} disabled={currentPage === 1} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50">Prev</button>
                {Array.from({ length: totalPages }).map((_, i) => (
                  <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 rounded-lg font-medium ${currentPage === i + 1 ? 'bg-rose-600 text-white' : 'border border-slate-300 hover:bg-slate-100'}`}>{i + 1}</button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage === totalPages} className="px-4 py-2 border border-slate-300 rounded-lg hover:bg-slate-100 disabled:opacity-50">Next</button>
              </div>
            )}

            <div className="text-center text-slate-600 text-sm">
              Page {currentPage} of {totalPages}
            </div>
          </>
        )}
      </main>

    </div>

  );
};



export default BlogList;