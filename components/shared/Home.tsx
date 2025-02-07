"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  createList,
  getAllLists,
  joinCampaign,
} from "@/lib/actions/list.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getUserById } from "@/lib/actions/user.action";
import { auth } from "@clerk/nextjs/server";

const Home = (props: { userId: any }) => {
  const { userId } = props;
  const [loading, setLoading] = useState(false);
  const [lists, setLists] = useState<{ _id: string; listName: string }[]>([]);
  const [selectedListId, setSelectedListId] = useState<string | null>(null); // Store the selected list ID
  const [campaignName, setCampaignName] = useState(""); // New state for campaign name
  const [user, setUser] = useState();
  const router = useRouter();
  // Fetch logged-in user's ID from localStorage
  useEffect(() => {
    const setUserId = async () => {
        const user = await getUserById(userId);
        setUser(user._id);
      try {
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    };
    setUserId();
  }, []);

  // Fetch all existing campaigns on mount
  useEffect(() => {
    const fetchLists = async () => {
      try {
        const fetchedLists = await getAllLists();
        setLists(fetchedLists);
      } catch (error) {
        console.error("Error fetching lists:", error);
      }
    };
    fetchLists();
  }, []);

  // Create a new campaign
  const handleCreateCampaign = async () => {
    if (!campaignName.trim()) {
      alert("Please enter a campaign name.");
      return;
    }

    setLoading(true);
    try {
      const newList = await createList(campaignName, []);
      setLists((prev) => [...prev, newList]); // Add to campaign list
      alert("Campaign created successfully!");
      setCampaignName(""); // Reset input field
    } catch (error) {
      console.error("Error creating campaign:", error);
      alert("Failed to create campaign.");
    }
    setLoading(false);
  };

  // Join an existing campaign
  const handleJoinCampaign = async () => {
    if (!selectedListId) {
      alert("Please select a campaign to join.");
      return;
    }
    if (!user) {
      alert("User not found. Please log in.");
      return;
    }

    setLoading(true);
    try {
      await joinCampaign(selectedListId, user); // Pass the listId (not name) to join the campaign
      alert("Successfully joined the campaign!");
    } catch (error) {
      console.error("Error joining campaign:", error);
      alert("Failed to join campaign.");
    }
    setLoading(false);
  };

  // Navigate to /schedule on Send Mails button click
  const handleSendMails = () => {
    router.push("/schedule");
  };

  return (
    <div className="main-container flex flex-col gap-4 p-6">
      {/* Input for Campaign Name */}
      <div className="flex gap-2">
        <Input
          type="text"
          placeholder="Enter Campaign Name"
          value={campaignName}
          onChange={(e) => setCampaignName(e.target.value)}
          className="w-60"
        />
        <Button
          onClick={handleCreateCampaign}
          disabled={loading || !campaignName.trim()}
        >
          {loading ? "Creating..." : "Create Campaign"}
        </Button>
      </div>

      {/* Join Campaign Dropdown */}
      <div className="flex items-center gap-2">
        <Select onValueChange={setSelectedListId}>
          {" "}
          {/* Update state with listId */}
          <SelectTrigger className="w-60">
            <SelectValue placeholder="Select Campaign" />
          </SelectTrigger>
          <SelectContent>
            {lists.length > 0 ? (
              lists.map((list) => (
                <SelectItem key={list._id} value={list._id}>
                  {" "}
                  {/* Use list._id for value */}
                  {list.listName}
                </SelectItem>
              ))
            ) : (
              <SelectItem disabled value={"No Campaigns Found"}>
                No Campaigns Found
              </SelectItem>
            )}
          </SelectContent>
        </Select>

        <Button
          onClick={handleJoinCampaign}
          disabled={loading || !selectedListId || !user}
        >
          {loading ? "Joining..." : "Join Campaign"}
        </Button>
      </div>

      {/* Send Mails Button - Navigates to /schedule */}
      <Button onClick={handleSendMails}>Send Mails</Button>
    </div>
  );
};

export default Home;
