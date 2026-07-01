import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const secret = searchParams.get('secret');
  const slug = searchParams.get('slug');

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    // Xoá cache trang danh sách blog
    revalidatePath('/blog');
    
    // Xoá cache trang bài viết chi tiết nếu có slug truyền vào
    if (slug) {
      revalidatePath(`/blog/${slug}`);
    }
    
    return NextResponse.json({ revalidated: true, now: Date.now() });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ message }, { status: 500 });
  }
}
