import { useContext, useState } from "react";
import "./comments.scss";
import { AuthContext } from "../../context/authContext";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import moment from "moment";

const Comments = ({ postId, comments, setComments, onCmtChange }) => {
	const [description, setDescription] = useState("");
	const { currentUser } = useContext(AuthContext);

	const { isLoading, error, data } = useQuery(["comments"], () =>
		makeRequest.get("/comments?postId=" + postId).then((res) => {
			return res.data;
		})
	);

	const queryClient = useQueryClient();

	const mutation = useMutation(
		(newComment) => {
			return makeRequest.post("/comments", newComment);
		},
		{
			onSuccess: () => {
				// Invalidate and refetch
				queryClient.invalidateQueries(["comments"]);
			},
		}
	);

	const handleClick = async (e) => {
		e.preventDefault();
		mutation.mutate({ description, postId });
		setDescription("");
		setComments(data);
		onCmtChange();
	};

	return (
		<div className="comments">
			<div className="write">
				<img
					src={"/upload/" + currentUser.profilePic}
					alt=""
				/>
				<input
					type="text"
					placeholder="write a comment"
					value={description}
					onChange={(e) => setDescription(e.target.value)}
				/>
				<button onClick={handleClick}>Send</button>
			</div>
			{error
				? "Something went wrong"
				: isLoading
				? "loading"
				: comments.map((comment) => (
						<div className="comment">
							<img
								src={"/upload/" + comment.profilePic}
								alt=""
							/>
							<div className="info">
								<span>{comment.name}</span>
								<p>{comment.description}</p>
							</div>
							<span className="date">{moment(comment.createdAt).fromNow()}</span>
						</div>
				  ))}
		</div>
	);
};

export default Comments;
