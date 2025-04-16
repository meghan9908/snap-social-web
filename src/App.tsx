
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SignedIn, SignedOut, RedirectToSignIn } from "@clerk/clerk-react";

import Index from "./pages/Index";
import ExplorePage from "./pages/ExplorePage";
import CreatePage from "./pages/CreatePage";
import ActivityPage from "./pages/ActivityPage";
import ProfilePage from "./pages/ProfilePage";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";
import { PostsProvider } from "./context/PostsContext";
import { ClerkUserProvider } from "./context/ClerkUserContext";

const queryClient = new QueryClient();

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SignedIn>{children}</SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ClerkUserProvider>
          <PostsProvider>
            <Routes>
              <Route path="/" element={<Layout><Index /></Layout>} />
              <Route 
                path="/explore" 
                element={
                  <Layout>
                    <ExplorePage />
                  </Layout>
                } 
              />
              <Route 
                path="/create" 
                element={
                  <ProtectedRoute>
                    <Layout><CreatePage /></Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/activity" 
                element={
                  <ProtectedRoute>
                    <Layout>
                      <ActivityPage />
                    </Layout>
                  </ProtectedRoute>
                } 
              />
              <Route 
                path="/profile" 
                element={
                  <Layout>
                    <ProfilePage />
                  </Layout>
                } 
              />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </PostsProvider>
        </ClerkUserProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
