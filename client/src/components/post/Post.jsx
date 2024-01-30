import "./post.scss";
import FavoriteBorderOutlinedIcon from "@mui/icons-material/FavoriteBorderOutlined";
import FavoriteOutlinedIcon from "@mui/icons-material/FavoriteOutlined";
import TextsmsOutlinedIcon from "@mui/icons-material/TextsmsOutlined";
import ShareOutlinedIcon from "@mui/icons-material/ShareOutlined";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";
import { Link } from "react-router-dom";
import Comments from "../comments/Comments";
import { useContext, useEffect, useState } from "react";
import moment from "moment";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import { AuthContext } from "../../context/authContext";

const Post = ({ post }) => {
	const [commentOpen, setCommentOpen] = useState(false);
	const [menuOpen, setMenuOpen] = useState(false);
	const [postComments, setPostComments] = useState([]);
	const { currentUser } = useContext(AuthContext);
	//TEMPORARY
	const queryClient = useQueryClient();
	const mutation = useMutation({
		mutationFn: (isLiked) => (isLiked ? makeRequest.delete("/likes?postId=" + post.id) : makeRequest.post("/likes", { postId: post.id })),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries(["likes"]);
		},
	});
	const { data, isLoading } = useQuery({
		queryKey: ["likes", post.id],
		queryFn: () =>
			makeRequest
				.get("/likes?postId=" + post.id)
				.then((res) => res.data)
				.catch(console.log),
	});

	const handleLike = (e) => {
		e.preventDefault();
		mutation.mutate(data.includes(currentUser.id));
	};
	const deleteMutation = useMutation({
		mutationFn: (postId) => makeRequest.delete("/posts/" + postId),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries(["posts"]);
		},
	});
	const deleteHandler = () => {
		deleteMutation.mutate(post.id);
	};
	const { data: comments, isLoading: commentsIsLoading } = useQuery({
		queryKey: ["comments"],
		queryFn: () =>
			makeRequest
				.get("/comments?postId=" + post.id)
				.then((res) => res.data)
				.catch(console.log),
	});
	const cmtMutation = useMutation({
		mutationFn: (newComment) => makeRequest.get("/comments", newComment),
		onSuccess: () => {
			// Invalidate and refetch
			queryClient.invalidateQueries(["comments"]);
			setPostComments(comments);
		},
	});
	useEffect(() => {
		setPostComments(comments);
	}, [isLoading, comments]);
	// console.log(post.id);
	return (
		<div className="post">
			<div className="container">
				<div className="user">
					<div className="userInfo">
						<img
							src={"/upload/" + post.profilePic}
							alt=""
						/>
						<div className="details">
							<Link
								to={`/profile/${post.userId}`}
								style={{ textDecoration: "none", color: "inherit" }}
							>
								<span className="name">{post.name}</span>
							</Link>
							<span className="date">{moment(post.createdAt).fromNow()}</span>
						</div>
					</div>
					<MoreHorizIcon onClick={() => setMenuOpen(!menuOpen)} />
					{menuOpen && post.userId === currentUser.id && <button onClick={deleteHandler}>Delete</button>}
				</div>
				<div className="content">
					<p>{post.description}</p>
					<img
						src={"./upload/" + post.img}
						alt=""
					/>
				</div>
				<div className="info">
					<div className="item">
						{isLoading ? (
							"Loading"
						) : data.includes(currentUser.id) ? (
							<FavoriteOutlinedIcon
								style={{ color: "red" }}
								onClick={handleLike}
							/>
						) : (
							<FavoriteBorderOutlinedIcon
								style={{ color: "red" }}
								onClick={handleLike}
							/>
						)}
						{isLoading ? "Loading" : data.length + " Likes"}
					</div>
					<div
						className="item"
						onClick={() => setCommentOpen(!commentOpen)}
					>
						<TextsmsOutlinedIcon />
						{commentsIsLoading ? "Loading" : comments.length + " Comments"}
					</div>
					<div className="item">
						<ShareOutlinedIcon />
						Share
					</div>
				</div>
				{commentOpen && (
					<Comments
						postId={post.id}
						comments={postComments}
						setComments={setPostComments}
						onCmtChange={() => {
							cmtMutation.mutate({ postId: post.id });
							setPostComments(comments);
						}}
					/>
				)}
			</div>
		</div>
	);
};

export default Post;
