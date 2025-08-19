import { useState } from "react";
import { Lightbulb, Target, Brain, Zap } from "lucide-react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Paper from "@mui/material/Paper";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const Recommendations = () => {
  const [username, setUsername] = useState("");
  const [topic, setTopic] = useState("");
  const [difficulty, setDifficulty] = useState("all");
  const [loading, setLoading] = useState(false);

  const handleGetRecommendations = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    setLoading(true);
    // TODO: Implement API call to get recommendations
    setTimeout(() => setLoading(false), 2000); // Simulate API call
  };

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        {/* Header */}
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Typography
            variant="h3"
            component="h1"
            fontWeight={700}
            color="text.primary"
            mb={2}
          >
            Smart Recommendations
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Get AI-powered problem recommendations based on your solving
            patterns and areas for improvement
          </Typography>
        </Box>

        {/* Input Section */}
        <Box sx={{ maxWidth: 600, mx: "auto", width: "100%" }}>
          <Box
            component="form"
            onSubmit={handleGetRecommendations}
            sx={{ display: "flex", flexDirection: "column", gap: 3 }}
          >
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", md: "row" },
              }}
            >
              <TextField
                fullWidth
                variant="outlined"
                placeholder="LeetCode username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Topic (optional)"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </Box>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <FormControl fullWidth variant="outlined">
                <InputLabel>Difficulty Level</InputLabel>
                <Select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  label="Difficulty Level"
                >
                  <MenuItem value="all">All Difficulties</MenuItem>
                  <MenuItem value="easy">Easy</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="hard">Hard</MenuItem>
                </Select>
              </FormControl>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={loading}
                startIcon={<Lightbulb style={{ height: 20, width: 20 }} />}
                sx={{
                  px: 4,
                  py: 1.5,
                  fontWeight: 600,
                  textTransform: "none",
                  minWidth: 200,
                }}
              >
                {loading ? "Analyzing..." : "Get Recommendations"}
              </Button>
            </Box>
          </Box>
        </Box>

        {/* Recommendation Categories */}
        <Box
          sx={{
            display: "flex",
            gap: 3,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          <Card elevation={3} sx={{ p: 3, flex: "1 1 300px", maxWidth: 400 }}>
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Target style={{ height: 24, width: 24, color: "#f44336" }} />
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Weakness-Based
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Problems targeting your weakest topics and patterns
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Coming soon...
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ p: 3, flex: "1 1 300px", maxWidth: 400 }}>
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Brain style={{ height: 24, width: 24, color: "#9c27b0" }} />
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Skill-Building
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Progressive problems to build specific algorithm skills
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Coming soon...
              </Typography>
            </CardContent>
          </Card>

          <Card elevation={3} sx={{ p: 3, flex: "1 1 300px", maxWidth: 400 }}>
            <CardContent sx={{ p: 0 }}>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}
              >
                <Zap style={{ height: 24, width: 24, color: "#ff9800" }} />
                <Typography variant="h6" fontWeight={600} color="text.primary">
                  Challenge Mode
                </Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" mb={2}>
                Advanced problems to push your problem-solving limits
              </Typography>
              <Typography variant="caption" color="text.disabled">
                Coming soon...
              </Typography>
            </CardContent>
          </Card>
        </Box>

        {/* Features Overview */}
        <Paper
          elevation={2}
          sx={{
            p: 4,
            textAlign: "center",
            background: "linear-gradient(45deg, #e8f5e9 30%, #f3e5f5 90%)",
          }}
        >
          <Typography variant="h4" fontWeight={700} color="text.primary" mb={3}>
            AI-Powered Insights
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            mb={4}
            sx={{ maxWidth: 600, mx: "auto" }}
          >
            Our recommendation engine analyzes your solving patterns, identifies
            knowledge gaps, and suggests optimal next problems for skill
            development.
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 4,
              flexWrap: "wrap",
              justifyContent: "center",
            }}
          >
            <Box sx={{ textAlign: "center", maxWidth: 200 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#e8f5e9",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Target style={{ height: 28, width: 28, color: "#4caf50" }} />
              </Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color="text.primary"
                mb={1}
              >
                Personalized
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Tailored to your unique solving style
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", maxWidth: 200 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#f3e5f5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Brain style={{ height: 28, width: 28, color: "#9c27b0" }} />
              </Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color="text.primary"
                mb={1}
              >
                Adaptive
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Evolves with your progress
              </Typography>
            </Box>
            <Box sx={{ textAlign: "center", maxWidth: 200 }}>
              <Box
                sx={{
                  width: 60,
                  height: 60,
                  bgcolor: "#fff3e0",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mx: "auto",
                  mb: 2,
                }}
              >
                <Zap style={{ height: 28, width: 28, color: "#ff9800" }} />
              </Box>
              <Typography
                variant="h6"
                fontWeight={600}
                color="text.primary"
                mb={1}
              >
                Efficient
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Optimal learning path
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};

export default Recommendations;
