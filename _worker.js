export default {
  async fetch(request) {
    const body = `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8">
  <meta name="robots" content="noindex, nofollow, noarchive">
  <title>404 Not Found</title>
</head>
<body>
  <h1>404 Not Found</h1>
  <p>삭제된 페이지입니다.</p>
</body>
</html>`;

    return new Response(request.method === "HEAD" ? null : body, {
      status: 404,
      headers: {
        "Content-Type": "text/html; charset=UTF-8",
        "Cache-Control": "no-store, no-cache, must-revalidate",
        "X-Robots-Tag": "noindex, nofollow, noarchive"
      }
    });
  }
};
