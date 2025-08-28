// utils/bookmark.ts
export function getBookmarks() {
  return JSON.parse(localStorage.getItem("bookmarks") || "[]");
}

export function saveBookmark(article: any) {
  const bookmarks = getBookmarks();
  if (!bookmarks.find((b: any) => b.link === article.link)) {
    bookmarks.push(article);
    localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
  }
}

export function removeBookmark(article: any) {
  let bookmarks = getBookmarks();
  bookmarks = bookmarks.filter((b: any) => b.link !== article.link);
  localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
}
