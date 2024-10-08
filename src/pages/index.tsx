import type { NextPageWithLayout } from '@/types';
import { NextSeo } from 'next-seo';
import { ICO } from '@/components/ico/ico';
import MinimalLayout from '@/layouts/_minimal';
const ICOPage: NextPageWithLayout = () => {
  return (
    <>
      <NextSeo title="ICO" description="NFTSwapper - ICO Boilerplate" />
      <ICO />
    </>
  );
};

ICOPage.getLayout = function getLayout(page) {
  return <MinimalLayout>{page}</MinimalLayout>;
};

export default ICOPage;
