import Card from "@/components/ui/Card";
import Hero from "@/components/ui/Hero";

export default function Home() {
  return (
    <div className="min-h-screen pt-24">
      {/* Hero Section */}
      <Hero
        title="Authentic Luxury,"
        gradientText="Verified by Blockchain"
        description="A decentralized marketplace ensuring authenticity for every luxury item through NFT certification."
      />

      {/* Features Section */}
      <section className="max-w-6xl mx-auto px-4 py-20 grid grid-cols-1 md:grid-cols-3 gap-12">
        <Card
          title="Verified Authenticity"
          description="Every item is authenticated and verified on the blockchain."
        />
        <Card
          title="Secure Transactions"
          description="Direct peer-to-peer transactions secured by smart contracts."
        />
        <Card
          title="NFT Certification"
          description="Unique digital certificates proving ownership and authenticity."
        />
      </section>
    </div>
  );
}
