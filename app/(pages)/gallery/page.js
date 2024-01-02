'use client';

// context
import { LoadingContext } from '@/app/lib/context/LoadingProvider';

// hooks
import { useEffect, useState, useContext } from 'react';

// chakra-ui
import {
  Box,
  Button,
  Heading,
  Link,
  Tag,
  Text,
  VStack,
} from '@chakra-ui/react';

// components
import Masonry, { ResponsiveMasonry } from 'react-responsive-masonry';
import { MoveRight } from 'lucide-react';

// local components
import ArtworkCard from '@/app/_components/products/artworkCard';

export default function Gallery() {
  const { setLoading } = useContext(LoadingContext);

  const [artworks, setArtworks] = useState(null);

  useEffect(() => {
    const getProjects = async () => {
      const res = await fetch('/api/supabase/getArtworks');
      const data = await res.json();
      setArtworks(data.artworks);
    };

    if (artworks === null) {
      setLoading(true);
      getProjects();
    } else {
      setLoading(true);

      setTimeout(() => {
        setLoading(false);
      }, 2000);
    }
  }, [artworks, setLoading]);

  return (
    <Box p={'4rem 0'}>
      <VStack
        textAlign={'center'}
        w={'100%'}
        mb={'4rem'}
        h={'fit-content'}
        position={'relative'}>
        <VStack maxW={'550px'}>
          <Tag
            textTransform={'uppercase'}
            size={'sm'}
            fontWeight={500}
            maxW={'fit-content'}
            colorScheme={'green'}
            borderRadius={'full'}>
            accepting commissions
          </Tag>
          <Heading textAlign={'center'}>taNrleMn</Heading>
          <Text mb={'1.5rem'}>
            These works range in creation date from early 2014 to the present.
            They traverse a plethora of identities and styles.
          </Text>
          <Link
            maxW={'fit-content'}
            href={'/commissions'}>
            <Button
              _hover={{
                outline: '1px solid var(--lightOrange, #F8AD4F)',
                borderRadius: 'var(--mainBorderRadius)',
              }}
              mr={'1rem'}
              rightIcon={<MoveRight />}
              background={'var(--midOrange)'}>
              Request a commission
            </Button>
          </Link>
        </VStack>
      </VStack>
      <Box p={'1rem'}>
        {artworks && (
          <ResponsiveMasonry
            columnsCountBreakPoints={{ 350: 1, 750: 2, 900: 3 }}>
            <Masonry gutter={'0.75rem'}>
              {artworks.map((artwork) => {
                return (
                  <ArtworkCard
                    key={artwork.id}
                    artwork={artwork}
                  />
                );
              })}
            </Masonry>
          </ResponsiveMasonry>
        )}
      </Box>
    </Box>
  );
}
