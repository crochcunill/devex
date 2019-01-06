'use strict';

import angular, { IController, IScope, uiNotification } from 'angular';
import { IStateService } from 'angular-ui-router';
import _ from 'lodash';
import { ICapabilitySkill } from '../../../capabilities/shared/ICapabilitySkillDTO';
import { IAuthenticationService } from '../../../users/client/services/AuthenticationService';
import { IUser } from '../../../users/shared/IUserDTO';
import { IOpportunitiesCommonService } from '../services/OpportunitiesCommonService';
import { IOpportunitiesService, IOpportunityResource } from '../services/OpportunitiesService';

interface IOpportunityCardScope extends IScope {
	opportunity: IOpportunityResource;
}

export class OpportunityCardDirectiveController implements IController {
	public static $inject = ['$scope', '$state', 'AuthenticationService', 'OpportunitiesCommonService', 'OpportunitiesService', 'ask', 'Notification'];

	public user: IUser;
	public isAdmin: boolean;
	public opportunity: IOpportunityResource;
	public oppSkills: ICapabilitySkill[];

	constructor(
		private $scope: IOpportunityCardScope,
		private $state: IStateService,
		private AuthenticationService: IAuthenticationService,
		private OpportunitiesCommonService: IOpportunitiesCommonService,
		private OpportunitiesService: IOpportunitiesService,
		private ask: any,
		private Notification: uiNotification.INotificationService
	) {
		this.user = this.AuthenticationService.user;
		this.isAdmin = this.user && this.AuthenticationService.user.roles.includes('admin');
		this.opportunity = $scope.opportunity;
		this.getOpportunitySkills();
	}

	public async publish(isPublishing: boolean): Promise<void> {
		const originalPublishedState = this.opportunity.isPublished;

		if (isPublishing) {
			const question = "When you publish this opportunity, we'll notify all our subscribed users. Are you sure you've got it just the way you want it?";
			const choice = await this.ask.yesNo(question);
			if (choice) {
				try {
					this.opportunity.isPublished = true;
					await this.OpportunitiesService.publish({ opportunityId: this.opportunity._id }).$promise;
					this.Notification.success({
						title: 'Success',
						message: '<i class="fas fa-check-circle"></i> Your opportunity has been published and we\'ve notified subscribers'
					});
				} catch (error) {
					this.Notification.error({
						title: 'Error',
						message: "<i class='fas fa-exclamation-triangle'></i> Error publishing opportunity"
					});
					this.opportunity.isPublished = originalPublishedState;
				}
			}
		} else {
			try {
				this.opportunity.isPublished = false;
				await this.OpportunitiesService.unpublish({ opportunityId: this.opportunity._id }).$promise;
				this.Notification.success({
					title: 'Success',
					message: '<i class="fas fa-check-circle"></i> Your opportunity has been unpublished'
				});
			} catch (error) {
				this.Notification.error({
					title: 'Error',
					message: "<i class='fas fa-exclamation-triangle'></i> Error unpublishing opportunity"
				});
				this.opportunity.isPublished = originalPublishedState;
			}
		}
	}

	public isUserAdmin(): boolean {
		return this.isAdmin || (this.user && this.user.roles.includes(`${this.opportunity.code}-admin`));
	}

	public isWatching(): boolean {
		return this.OpportunitiesCommonService.isWatching(this.opportunity);
	}

	public toggleWatch(): void {
		if (this.isWatching()) {
			this.opportunity.isWatching = this.OpportunitiesCommonService.removeWatch(this.opportunity);
		} else {
			this.opportunity.isWatching = this.OpportunitiesCommonService.addWatch(this.opportunity);
		}
	}

	public goToView(): void {
		if (this.opportunity.opportunityTypeCd === 'code-with-us') {
			this.$state.go('opportunities.viewcwu', {
				opportunityId: this.opportunity.code
			});
		} else {
			this.$state.go('opportunities.viewswu', {
				opportunityId: this.opportunity.code
			});
		}
	}

	public goToEditView(): void {
		if (this.opportunity.opportunityTypeCd === 'code-with-us') {
			this.$state.go('opportunityadmin.editcwu', {
				opportunityId: this.opportunity.code
			});
		} else {
			this.$state.go('opportunityadmin.editswu', {
				opportunityId: this.opportunity.code
			});
		}
	}

	public getDeadline(): string {
		let ret = 'CLOSED';
		const dateDiff = new Date(this.opportunity.deadline).getTime() - new Date().getTime();
		if (dateDiff > 0) {
			const dd = Math.floor(dateDiff / 86400000); // days
			const dh = Math.floor((dateDiff % 86400000) / 3600000); // hours
			const dm = Math.round(((dateDiff % 86400000) % 3600000) / 60000); // minutes
			if (dd > 0) {
				ret = dd + ' days ' + dh + ' hours ' + dm + ' minutes';
			} else if (dh > 0) {
				ret = dh + ' hours ' + dm + ' minutes';
			} else {
				ret = dm + ' minutes';
			}
		}
		return ret;
	}

	public getOpportunitySkills(): void {

		if (this.opportunity.opportunityTypeCd === 'code-with-us') {
			this.oppSkills = this.opportunity.skills.map(sk => {
				return { name: sk, _id: '', code: '' }
			});
		} else {
			this.oppSkills = _.flatten(
				_.unionWith(
					this.opportunity.phases.inception.capabilitySkills,
					this.opportunity.phases.proto.capabilitySkills,
					this.opportunity.phases.implementation.capabilitySkills,
					(sk1, sk2) => sk1.code === sk2.code
				)
			);
		}
	}
}

angular.module('opportunities').directive('opportunityCard', [
	'$state',
	($state: IStateService) => {
		return {
			restrict: 'E',
			controllerAs: 'vm',
			scope: {
				opportunity: '='
			},
			templateUrl: '/modules/opportunities/client/views/opportunity-card-directive.html',
			controller: OpportunityCardDirectiveController
		};
	}
]);
