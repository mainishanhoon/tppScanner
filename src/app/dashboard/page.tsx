import { Card, CardContent } from '@/components/ui/card';
import { prisma } from '@/lib/prisma';
import { columns } from '@/components/table/Columns';
import { DataTable } from '@/components/table/DataTable';
import { Suspense } from 'react';
import UsersLoading from './loading';
import PageContainer from '@/components/PageContainer';

export default async function UsersRoute() {
  const data = await prisma.tpp_2.findMany({
    orderBy: { bookedAt: 'desc' },
  });

  return (
    <PageContainer>
      <Suspense fallback={<UsersLoading />}>
        <Card className="bg-muted">
          <CardContent className="pt-6">
            <DataTable data={data} columns={columns} />
          </CardContent>
        </Card>
      </Suspense>
    </PageContainer>
  );
}
