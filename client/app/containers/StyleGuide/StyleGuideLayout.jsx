import React from 'react';
import StyleGuideComponentTitle from '../../components/StyleGuideComponentTitle';
import StyleGuideAction from './StyleGuideAction';

let StyleGuideLayout = () => {

  return (
  <div>
    <div className="usa-width-one-whole">
    <h2 id="layout">Layout</h2>
  </div>

    <StyleGuideComponentTitle
        title="Action"
        id="action"
        link="StyleGuideAction.jsx"
        isSubsection={true}
    />

    <p>
      For most task-based pages, Primary and Secondary Actions sit under the App Canvas.
      The number of actions per page should be limited intentionally.
      These tasks should relate specifically to the user’s goal for the page they are on.
    </p>

    <p>
      The actions at the bottom of the page are arranged such as the primary
      task (the task that takes the user forward) is on the bottom right of the App Canvas.
      The label of this action usually hints at the title of the next page.
      Escape actions are placed to the left of the primary action.
      On the bottom left, of the App Canvas, there will be a back link,
      preferably with a description of where the user will go to
      or a link to the main page after a user has completed a task.
      These are actions that allow the user to move back a step
      or completely leave the task they’re working on.
    </p>
    <p>
      The consistent layout and arrangement of these actions
      reinforces the users mental model as the use Caseflow.
      You should avoid placing these actions in other parts
      of the page without good reason.
    </p>
    <StyleGuideAction />
  </div>

  );
};

export default StyleGuideLayout;