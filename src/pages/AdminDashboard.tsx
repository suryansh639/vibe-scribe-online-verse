
import { useState } from "react";
import Layout from "@/components/layout/Layout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Search, AlertTriangle } from "lucide-react";
import { articles, users } from "@/data/mockData";
import { Link } from "react-router-dom";

// Type for mock report
interface Report {
  id: string;
  reportedItemType: "article" | "comment" | "user";
  reportedItemId: string;
  reason: string;
  reportedBy: string;
  status: "pending" | "resolved" | "rejected";
  createdAt: string;
}

// Mock reports data
const reports: Report[] = [
  {
    id: "report1",
    reportedItemType: "comment",
    reportedItemId: "comment1",
    reason: "Inappropriate content",
    reportedBy: "user3",
    status: "pending",
    createdAt: "2023-04-11T15:32:00Z"
  },
  {
    id: "report2",
    reportedItemType: "article",
    reportedItemId: "article5",
    reason: "Misleading information",
    reportedBy: "user2",
    status: "pending",
    createdAt: "2023-04-10T09:47:00Z"
  },
  {
    id: "report3",
    reportedItemType: "user",
    reportedItemId: "user4",
    reason: "Spam",
    reportedBy: "user1",
    status: "resolved",
    createdAt: "2023-04-08T14:23:00Z"
  }
];

const AdminDashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  
  // Filter users based on search query
  const filteredUsers = users.filter(user => 
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    user.email.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  // Filter articles based on search query
  const filteredArticles = articles.filter(article => 
    article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    article.author.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-gray-600">Manage your platform content and users</p>
        </header>
        
        {/* Search */}
        <div className="mb-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <Input
              type="text"
              placeholder="Search users, articles..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <Tabs defaultValue="users">
          <TabsList className="mb-8">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
          </TabsList>
          
          {/* Users Tab */}
          <TabsContent value="users">
            <div className="bg-white rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Articles</TableHead>
                    <TableHead>Followers</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredUsers.map(user => (
                    <TableRow key={user.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <Avatar className="h-8 w-8">
                            <AvatarImage src={user.avatar} />
                            <AvatarFallback className="bg-brand-orange text-white">
                              {user.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          <span className="font-medium">{user.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>
                        {articles.filter(article => article.author.id === user.id).length}
                      </TableCell>
                      <TableCell>{user.followers}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link to={`/profile/${user.id}`} className="w-full">View Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Edit User</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Suspend User</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Content Tab */}
          <TabsContent value="content">
            <div className="bg-white rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Title</TableHead>
                    <TableHead>Author</TableHead>
                    <TableHead>Published</TableHead>
                    <TableHead>Likes</TableHead>
                    <TableHead>Comments</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredArticles.map(article => (
                    <TableRow key={article.id}>
                      <TableCell>
                        <div className="font-medium">{article.title}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={article.author.avatar} />
                            <AvatarFallback className="bg-brand-orange text-white text-xs">
                              {article.author.name.charAt(0)}
                            </AvatarFallback>
                          </Avatar>
                          {article.author.name}
                        </div>
                      </TableCell>
                      <TableCell>
                        {new Date(article.publishedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{article.likes}</TableCell>
                      <TableCell>{article.comments}</TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Link to={`/article/${article.id}`} className="w-full">View Article</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem>Feature Article</DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500">Remove Article</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
          
          {/* Reports Tab */}
          <TabsContent value="reports">
            <div className="bg-white rounded-lg border border-gray-200">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reported Item</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Reported By</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map(report => (
                    <TableRow key={report.id}>
                      <TableCell>
                        <div className="flex items-center">
                          {report.reportedItemType === "article" && (
                            <>
                              <span className="font-medium">Article: </span>
                              <span className="truncate ml-1">
                                {articles.find(a => a.id === report.reportedItemId)?.title || "Unknown article"}
                              </span>
                            </>
                          )}
                          {report.reportedItemType === "comment" && (
                            <span className="font-medium">Comment</span>
                          )}
                          {report.reportedItemType === "user" && (
                            <>
                              <span className="font-medium">User: </span>
                              <span className="ml-1">
                                {users.find(u => u.id === report.reportedItemId)?.name || "Unknown user"}
                              </span>
                            </>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <AlertTriangle size={16} className="text-amber-500" />
                          {report.reason}
                        </div>
                      </TableCell>
                      <TableCell>
                        {users.find(u => u.id === report.reportedBy)?.name || "Anonymous"}
                      </TableCell>
                      <TableCell>
                        {new Date(report.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <div className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                          ${report.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${report.status === 'resolved' ? 'bg-green-100 text-green-800' : ''}
                          ${report.status === 'rejected' ? 'bg-gray-100 text-gray-800' : ''}
                        `}>
                          {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                        </div>
                      </TableCell>
                      <TableCell>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal size={16} />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Details</DropdownMenuItem>
                            <DropdownMenuItem>Mark as Resolved</DropdownMenuItem>
                            <DropdownMenuItem>Reject Report</DropdownMenuItem>
                            {report.reportedItemType === "article" && (
                              <DropdownMenuItem className="text-red-500">Remove Article</DropdownMenuItem>
                            )}
                            {report.reportedItemType === "comment" && (
                              <DropdownMenuItem className="text-red-500">Remove Comment</DropdownMenuItem>
                            )}
                            {report.reportedItemType === "user" && (
                              <DropdownMenuItem className="text-red-500">Suspend User</DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default AdminDashboard;
