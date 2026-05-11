import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Recycle, User, ShoppingCart, Trophy, Star, TrendingUp, Award } from 'lucide-react';
// data to be changed later
const TOP_SELLERS = [
    {
        rank: 1,
        name: 'AutoParts Pro',
        type: 'Business',
        sales: 1247,
        rating: 4.9,
        revenue: 125480,
        location: 'Los Angeles, CA',
        badge: 'gold',
    },
    {
        rank: 2,
        name: 'Green Motors',
        type: 'Business',
        sales: 1089,
        rating: 4.8,
        revenue: 98750,
        location: 'Chicago, IL',
        badge: 'silver',
    },
    {
        rank: 3,
        name: 'RecycleAuto Center',
        type: 'Recycler',
        sales: 956,
        rating: 4.9,
        revenue: 87650,
        location: 'Houston, TX',
        badge: 'bronze',
    },
    {
        rank: 4,
        name: 'Parts Paradise',
        type: 'Business',
        sales: 845,
        rating: 4.7,
        revenue: 76320,
        location: 'Phoenix, AZ',
        badge: 'none',
    },
    {
        rank: 5,
        name: 'Eco Auto Parts',
        type: 'Recycler',
        sales: 789,
        rating: 4.8,
        revenue: 68900,
        location: 'San Diego, CA',
        badge: 'none',
    },
    {
        rank: 6,
        name: 'Premium Motors Supply',
        type: 'Business',
        sales: 723,
        rating: 4.6,
        revenue: 62150,
        location: 'Dallas, TX',
        badge: 'none',
    },
    {
        rank: 7,
        name: 'Quick Parts Inc',
        type: 'Business',
        sales: 687,
        rating: 4.7,
        revenue: 58900,
        location: 'Miami, FL',
        badge: 'none',
    },
    {
        rank: 8,
        name: 'Sarah Johnson',
        type: 'User',
        sales: 645,
        rating: 4.9,
        revenue: 52340,
        location: 'Seattle, WA',
        badge: 'none',
    },
    {
        rank: 9,
        name: 'Mike\'s Auto Shop',
        type: 'Business',
        sales: 598,
        rating: 4.5,
        revenue: 48750,
        location: 'Denver, CO',
        badge: 'none',
    },
    {
        rank: 10,
        name: 'GreenWheels Recycling',
        type: 'Recycler',
        sales: 567,
        rating: 4.8,
        revenue: 45230,
        location: 'Portland, OR',
        badge: 'none',
    },
];

const TOP_BUYERS = [
    {
        rank: 1,
        name: 'Complete Auto Repair',
        purchases: 456,
        totalSpent: 45680,
        location: 'Boston, MA',
    },
    {
        rank: 2,
        name: 'City Garage',
        purchases: 389,
        totalSpent: 38920,
        location: 'New York, NY',
    },
    {
        rank: 3,
        name: 'Tom Wilson',
        purchases: 342,
        totalSpent: 32450,
        location: 'Austin, TX',
    },
];

const RISING_STARS = [
    {
        rank: 1,
        name: 'FastParts Hub',
        type: 'Business',
        growth: 245,
        sales: 187,
        joinedMonths: 3,
    },
    {
        rank: 2,
        name: 'EcoRecycle Solutions',
        type: 'Recycler',
        growth: 198,
        sales: 156,
        joinedMonths: 2,
    },
    {
        rank: 3,
        name: 'Jennifer Martinez',
        type: 'User',
        growth: 167,
        sales: 134,
        joinedMonths: 4,
    },
];

export function Leaderboard() {
    const getBadgeIcon = (badge) => {
        if (badge === 'gold') return <Trophy className="w-6 h-6 text-yellow-500" />;
        if (badge === 'silver') return <Award className="w-6 h-6 text-gray-400" />;
        if (badge === 'bronze') return <Award className="w-6 h-6 text-orange-600" />;
        return null;
    };

    return (
        <div className="min-h-screen bg-background">
            {/* Header */}
            <header className="border-b border-border bg-card sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <Link to="/" className="flex items-center gap-3">
                            <div className="bg-primary p-2 rounded-lg">
                                <Recycle className="w-6 h-6 text-primary-foreground" />
                            </div>
                            <h1 className="text-2xl text-foreground">SpareXchange</h1>
                        </Link>

                        <nav className="hidden md:flex items-center gap-6">
                            <Link to="/" className="text-foreground hover:text-primary">Home</Link>
                            <Link to="/marketplace" className="text-foreground hover:text-primary">Marketplace</Link>
                            <Link to="/leaderboard" className="text-primary">Leaderboard</Link>
                        </nav>

                        <div className="flex items-center gap-4">
                            <Link to="/cart">
                                <Button variant="ghost" size="icon" className="relative">
                                    <ShoppingCart className="w-5 h-5" />
                                </Button>
                            </Link>
                            <Link to="/profile">
                                <Button variant="ghost" size="icon">
                                    <User className="w-5 h-5" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <div className="bg-gradient-to-br from-green-600 to-green-900 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                        <h1 className="text-5xl mb-4 text-white">Leaderboard</h1>
                        <p className="text-xl text-green-50 max-w-2xl mx-auto">
                            Celebrating our top sellers, buyers, and rising stars in the SpareXchange community
                        </p>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <Tabs defaultValue="sellers" className="w-full">
                    <TabsList className="grid w-full grid-cols-3 mb-8">
                        <TabsTrigger value="sellers">Top Sellers</TabsTrigger>
                        <TabsTrigger value="buyers">Top Buyers</TabsTrigger>
                        <TabsTrigger value="rising">Rising Stars</TabsTrigger>
                    </TabsList>

                    {/* Top Sellers */}
                    <TabsContent value="sellers">
                        <div className="space-y-4">
                            {TOP_SELLERS.map((seller) => (
                                <Card key={seller.rank} className={seller.rank <= 3 ? 'border-primary' : ''}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0">
                                                {seller.rank <= 3 ? (
                                                    <div className="relative">
                                                        <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-2xl text-foreground">
                                                            {seller.rank}
                                                        </div>
                                                        <div className="absolute -top-2 -right-2">
                                                            {getBadgeIcon(seller.badge)}
                                                        </div>
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl text-foreground">
                                                        {seller.rank}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl text-foreground truncate">{seller.name}</h3>
                                                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                                                        {seller.type}
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                                    <div className="flex items-center gap-1">
                                                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                                        <span>{seller.rating}</span>
                                                    </div>
                                                    <span>•</span>
                                                    <span>{seller.location}</span>
                                                </div>
                                            </div>

                                            <div className="flex gap-8 text-center">
                                                <div>
                                                    <div className="text-2xl text-primary">{seller.sales}</div>
                                                    <div className="text-sm text-muted-foreground">Sales</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl text-foreground">
                                                        ${(seller.revenue / 1000).toFixed(1)}k
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Revenue</div>
                                                </div>
                                            </div>

                                            <Button variant="outline">
                                                View Profile
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Top Buyers */}
                    <TabsContent value="buyers">
                        <div className="space-y-4">
                            {TOP_BUYERS.map((buyer) => (
                                <Card key={buyer.rank} className={buyer.rank <= 3 ? 'border-primary' : ''}>
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0">
                                                {buyer.rank <= 3 ? (
                                                    <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center text-2xl text-foreground">
                                                        {buyer.rank}
                                                    </div>
                                                ) : (
                                                    <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center text-2xl text-foreground">
                                                        {buyer.rank}
                                                    </div>
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <h3 className="text-xl mb-1 text-foreground truncate">{buyer.name}</h3>
                                                <p className="text-sm text-muted-foreground">{buyer.location}</p>
                                            </div>

                                            <div className="flex gap-8 text-center">
                                                <div>
                                                    <div className="text-2xl text-primary">{buyer.purchases}</div>
                                                    <div className="text-sm text-muted-foreground">Purchases</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl text-foreground">
                                                        ${(buyer.totalSpent / 1000).toFixed(1)}k
                                                    </div>
                                                    <div className="text-sm text-muted-foreground">Total Spent</div>
                                                </div>
                                            </div>

                                            <Button variant="outline">
                                                Contact
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>

                    {/* Rising Stars */}
                    <TabsContent value="rising">
                        <div className="mb-6 bg-secondary p-4 rounded-lg">
                            <div className="flex items-center gap-2 text-foreground">
                                <TrendingUp className="w-5 h-5 text-primary" />
                                <p className="text-sm">
                                    Rising Stars are new sellers showing exceptional growth in their first few months
                                </p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {RISING_STARS.map((seller) => (
                                <Card key={seller.rank} className="border-primary">
                                    <CardContent className="p-6">
                                        <div className="flex items-center gap-4">
                                            <div className="flex-shrink-0">
                                                <div className="w-16 h-16 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-2xl text-white">
                                                    {seller.rank}
                                                </div>
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-3 mb-1">
                                                    <h3 className="text-xl text-foreground truncate">{seller.name}</h3>
                                                    <Badge variant="secondary" className="bg-secondary text-secondary-foreground">
                                                        {seller.type}
                                                    </Badge>
                                                    <Badge className="bg-primary text-primary-foreground">
                                                        <TrendingUp className="w-3 h-3 mr-1" />
                                                        New
                                                    </Badge>
                                                </div>
                                                <p className="text-sm text-muted-foreground">
                                                    Joined {seller.joinedMonths} months ago
                                                </p>
                                            </div>

                                            <div className="flex gap-8 text-center">
                                                <div>
                                                    <div className="text-2xl text-primary">+{seller.growth}%</div>
                                                    <div className="text-sm text-muted-foreground">Growth</div>
                                                </div>
                                                <div>
                                                    <div className="text-2xl text-foreground">{seller.sales}</div>
                                                    <div className="text-sm text-muted-foreground">Sales</div>
                                                </div>
                                            </div>

                                            <Button variant="outline">
                                                View Profile
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    </TabsContent>
                </Tabs>

                {/* CTA Section */}
                <Card className="mt-12 bg-gradient-to-br from-green-600 to-green-900 text-white border-0">
                    <CardContent className="p-12 text-center">
                        <Trophy className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
                        <h2 className="text-3xl mb-4 text-white">Want to Join the Leaderboard?</h2>
                        <p className="text-xl text-green-50 mb-6 max-w-2xl mx-auto">
                            Start selling quality auto parts and build your reputation in the SpareXchange community.
                        </p>
                        <div className="flex flex-wrap justify-center gap-4">
                            <Link to="/signup">
                                <Button size="lg" className="bg-white text-green-600 hover:bg-gray-100">
                                    Create Account
                                </Button>
                            </Link>
                            <Link to="/marketplace">
                                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                                    Browse Marketplace
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

