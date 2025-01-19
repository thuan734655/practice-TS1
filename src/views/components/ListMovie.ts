import { IMedia } from '../../models/mediaForm';
import { IcStar } from '../../resources/assets/icons';

const LoadMovies =  (media: IMedia[]) : string => {
  console.log('Loading movies',media)
 return media.map((data) => {
         return `
           <div class="list-movies-container" id="${data.id}" selected="true">
             <div class="list-movies-container--head">
               <div class="head-box">
                 <img src="${IcStar}" alt="icon star">
                 <p>${data.rating.toFixed(1)}</p>
               </div>
             </div>
             <div class="list-movies-container--body">
               <img src="http://localhost:5001/${data.avatar}" alt="avatar">
             </div>
             <div class="list-movies-container--footer">
               <p>${data.movie_name}</p>
             </div>
             <div class="action-buttons" style="display: none;">
               <button class="btn-view">View Details</button>
               <button class="btn-edit">Update</button>
               <button class="btn-delete">Delete</button>
             </div>
           </div>
         `;
       })
       .join('');
}

export default LoadMovies;