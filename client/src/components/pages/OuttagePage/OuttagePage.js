import React, { Component } from 'react';
import axios from 'axios';

import { Modal, Button } from 'semantic-ui-react';

import BodyCard from '../../atoms/BodyCard/BodyCard';
import UpdateCard from '../../molecules/UpdateCard/UpdateCard';
import AddEditJobUpdate from '../../molecules/AddEditJobUpdate/AddEditJobUpdate';

class OuttagePage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			currentOuttage: {},
			updates: [],
			modalOpen: false
		};
	}

	componentDidMount() {
		const jwtoken = localStorage.getItem('jwtoken');

		if (this.state.currentOuttage) {
			axios
				.get(`/api/outtage/${this.props.match.params.id}`, {
					headers: {
						token: jwtoken
					}
				})
				.then(res => {
					this.setState(
						{
							currentOuttage: res.data.data
						},
						() => {
							this.getUpdates();
						}
					);
				});
		}
	}

	getUpdates() {
		const jwtoken = localStorage.getItem('jwtoken');

		if (this.state.currentOuttage) {
			axios
				.get(`/api/outtage/${this.state.currentOuttage.id}/updates`, {
					headers: {
						token: jwtoken
					}
				})
				.then(res => {
					if (res.data.success) {
						this.setState({ updates: res.data.data });
					} else {
					}
				});
		}
	}

	handleJobUpdate() {
		this.getUpdates();

		this.setState({
			modalOpen: false
		});
	}

	handleOpen = () => this.setState({ modalOpen: true });

	handleClose = () => this.setState({ modalOpen: false });

	render() {
		if (!this.state.currentOuttage || !this.state.currentOuttage.id) {
			return 'Outtage not found';
		} else {
			return (
				<div className="outtage-page">
					<div className="outtage-information">
						<h1>Outage</h1>
						<p>
							{this.state.currentOuttage.address},{' '}
							{this.state.currentOuttage.city}{' '}
							{this.state.currentOuttage.zip}
						</p>

						<BodyCard className="information-table">
							<aside>
								<label>Id</label>
								{this.state.currentOuttage.id}
							</aside>

							<aside>
								<label>Type</label>
								{this.state.currentOuttage.type}
							</aside>

							<aside>
								<label>Customers Impacted</label>
								{this.state.currentOuttage.customersImpacted}
							</aside>

							<aside>
								<label>Reason</label>
								{this.state.currentOuttage.reason}
							</aside>
							<aside>
								<label>Outtage Start Time</label>
								{this.state.currentOuttage.outtageStartTime}
							</aside>
							<aside>
								<label>Estimated Restoration Time</label>
								{
									this.state.currentOuttage
										.estimatedRestorationTime
								}
							</aside>
						</BodyCard>
					</div>
					<div className="updates-container">
						<h2>Updates</h2>
						{this.state.updates.length > 0 ? (
							this.state.updates.map(update => {
								return (
									<UpdateCard key={update._id} {...update} />
								);
							})
						) : (
							<div className="update-helper-text">
								No Updates Yet. Add an update .
							</div>
						)}

						<Modal
							trigger={
								<Button
									onClick={this.handleOpen.bind(this)}
									className="add-update-button"
								>
									Add Update
								</Button>
							}
							open={this.state.modalOpen}
							onClose={this.handleClose}
						>
							<Modal.Content image>
								<AddEditJobUpdate
									outtageId={this.state.currentOuttage.id}
									jobUpdated={this.handleJobUpdate.bind(this)}
								/>
							</Modal.Content>
						</Modal>
					</div>
				</div>
			);
		}
	}
}

export default OuttagePage;
