import { Suspense } from 'react';
import { NotFoundPage } from '@/views/NotFoundPage';

export default function NotFound() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#eff0f5]" />}>
      <NotFoundPage />
    </Suspense>
  );
}
